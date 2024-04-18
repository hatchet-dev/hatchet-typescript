// eslint-disable-next-line max-classes-per-file
import { Channel, ClientFactory, Status } from 'nice-grpc';
import { EventEmitter, on } from 'events';
import {
  DispatcherClient as PbDispatcherClient,
  DispatcherDefinition,
  ResourceEventType,
  ResourceType,
} from '@hatchet/protoc/dispatcher';
import { ClientConfig } from '@clients/hatchet-client/client-config';
import HatchetError from '@util/errors/hatchet-error';
import { Logger } from '@hatchet/util/logger';
import sleep from '@hatchet/util/sleep';
import { Api } from '../rest';
import { WorkflowRunStatus } from '../rest/generated/data-contracts';

const DEFAULT_EVENT_LISTENER_RETRY_INTERVAL = 5; // seconds
const DEFAULT_EVENT_LISTENER_RETRY_COUNT = 5;
const DEFAULT_EVENT_LISTENER_POLL_INTERVAL = 5000; // milliseconds

// eslint-disable-next-line no-shadow
export enum RunEventType {
  STEP_RUN_EVENT_TYPE_STARTED = 'STEP_RUN_EVENT_TYPE_STARTED',
  STEP_RUN_EVENT_TYPE_COMPLETED = 'STEP_RUN_EVENT_TYPE_COMPLETED',
  STEP_RUN_EVENT_TYPE_FAILED = 'STEP_RUN_EVENT_TYPE_FAILED',
  STEP_RUN_EVENT_TYPE_CANCELLED = 'STEP_RUN_EVENT_TYPE_CANCELLED',
  STEP_RUN_EVENT_TYPE_TIMED_OUT = 'STEP_RUN_EVENT_TYPE_TIMED_OUT',
  STEP_RUN_EVENT_TYPE_STREAM = 'STEP_RUN_EVENT_TYPE_STREAM',
  WORKFLOW_RUN_EVENT_TYPE_STARTED = 'WORKFLOW_RUN_EVENT_TYPE_STARTED',
  WORKFLOW_RUN_EVENT_TYPE_COMPLETED = 'WORKFLOW_RUN_EVENT_TYPE_COMPLETED',
  WORKFLOW_RUN_EVENT_TYPE_FAILED = 'WORKFLOW_RUN_EVENT_TYPE_FAILED',
  WORKFLOW_RUN_EVENT_TYPE_CANCELLED = 'WORKFLOW_RUN_EVENT_TYPE_CANCELLED',
  WORKFLOW_RUN_EVENT_TYPE_TIMED_OUT = 'WORKFLOW_RUN_EVENT_TYPE_TIMED_OUT',
}

const stepEventTypeMap: Record<ResourceEventType, RunEventType | undefined> = {
  [ResourceEventType.RESOURCE_EVENT_TYPE_STARTED]: RunEventType.STEP_RUN_EVENT_TYPE_STARTED,
  [ResourceEventType.RESOURCE_EVENT_TYPE_COMPLETED]: RunEventType.STEP_RUN_EVENT_TYPE_COMPLETED,
  [ResourceEventType.RESOURCE_EVENT_TYPE_FAILED]: RunEventType.STEP_RUN_EVENT_TYPE_FAILED,
  [ResourceEventType.RESOURCE_EVENT_TYPE_CANCELLED]: RunEventType.STEP_RUN_EVENT_TYPE_CANCELLED,
  [ResourceEventType.RESOURCE_EVENT_TYPE_TIMED_OUT]: RunEventType.STEP_RUN_EVENT_TYPE_TIMED_OUT,
  [ResourceEventType.RESOURCE_EVENT_TYPE_STREAM]: RunEventType.STEP_RUN_EVENT_TYPE_STREAM,
  [ResourceEventType.RESOURCE_EVENT_TYPE_UNKNOWN]: undefined,
  [ResourceEventType.UNRECOGNIZED]: undefined,
};

const workflowEventTypeMap: Record<ResourceEventType, RunEventType | undefined> = {
  [ResourceEventType.RESOURCE_EVENT_TYPE_STARTED]: RunEventType.WORKFLOW_RUN_EVENT_TYPE_STARTED,
  [ResourceEventType.RESOURCE_EVENT_TYPE_COMPLETED]: RunEventType.WORKFLOW_RUN_EVENT_TYPE_COMPLETED,
  [ResourceEventType.RESOURCE_EVENT_TYPE_FAILED]: RunEventType.WORKFLOW_RUN_EVENT_TYPE_FAILED,
  [ResourceEventType.RESOURCE_EVENT_TYPE_CANCELLED]: RunEventType.WORKFLOW_RUN_EVENT_TYPE_CANCELLED,
  [ResourceEventType.RESOURCE_EVENT_TYPE_TIMED_OUT]: RunEventType.WORKFLOW_RUN_EVENT_TYPE_TIMED_OUT,
  [ResourceEventType.RESOURCE_EVENT_TYPE_UNKNOWN]: undefined,
  [ResourceEventType.RESOURCE_EVENT_TYPE_STREAM]: undefined,
  [ResourceEventType.UNRECOGNIZED]: undefined,
};

const resourceTypeMap: Record<
  ResourceType,
  Record<ResourceEventType, RunEventType | undefined> | undefined
> = {
  [ResourceType.RESOURCE_TYPE_STEP_RUN]: stepEventTypeMap,
  [ResourceType.RESOURCE_TYPE_WORKFLOW_RUN]: workflowEventTypeMap,
  [ResourceType.RESOURCE_TYPE_UNKNOWN]: undefined,
  [ResourceType.UNRECOGNIZED]: undefined,
};

const workflowStatusMap: Record<WorkflowRunStatus, RunEventType | undefined> = {
  [WorkflowRunStatus.SUCCEEDED]: RunEventType.WORKFLOW_RUN_EVENT_TYPE_COMPLETED,
  [WorkflowRunStatus.FAILED]: RunEventType.WORKFLOW_RUN_EVENT_TYPE_FAILED,
  [WorkflowRunStatus.CANCELLED]: RunEventType.WORKFLOW_RUN_EVENT_TYPE_CANCELLED,
  [WorkflowRunStatus.PENDING]: undefined,
  [WorkflowRunStatus.RUNNING]: undefined,
  [WorkflowRunStatus.QUEUED]: undefined,
};

export interface StepRunEvent {
  type: RunEventType;
  payload: string;
}

export class PollingAsyncListener {
  client: ListenerClient;

  q: Array<StepRunEvent> = [];
  eventEmitter = new EventEmitter();

  pollInterval: any;

  constructor(workflowRunid: string, client: ListenerClient) {
    this.client = client;
    this.listen(workflowRunid);
    this.polling(workflowRunid);
  }

  emit(event: StepRunEvent) {
    this.q.push(event);
    this.eventEmitter.emit('event');
  }

  async listen(workflowRunId: string) {
    let listener = this.client.client.subscribeToWorkflowEvents({
      workflowRunId,
    });

    const res = await this.getWorkflowRun(workflowRunId);

    if (res) {
      this.emit(res);
      this.close();
    }

    try {
      for await (const workflowEvent of listener) {
        const eventType = resourceTypeMap[workflowEvent.resourceType]?.[workflowEvent.eventType];
        if (eventType) {
          if (eventType === RunEventType.WORKFLOW_RUN_EVENT_TYPE_COMPLETED) {
            // OPTIMZATION - consider including the workflow run data in the event?
            const data = await this.getWorkflowRun(workflowRunId);
            if (data) {
              this.emit(data);
            }
          } else {
            this.emit({
              type: eventType,
              payload: workflowEvent.eventPayload,
            });
          }
        }
      }
    } catch (e: any) {
      if (e.code === Status.CANCELLED) {
        return;
      }
      if (e.code === Status.UNAVAILABLE) {
        listener = await this.retrySubscribe(workflowRunId);
      }
    }

    setTimeout(() => this.close(), DEFAULT_EVENT_LISTENER_POLL_INTERVAL * 5);
  }

  async retrySubscribe(workflowRunId: string) {
    let retries = 0;

    while (retries < DEFAULT_EVENT_LISTENER_RETRY_COUNT) {
      try {
        await sleep(DEFAULT_EVENT_LISTENER_RETRY_INTERVAL);

        const listener = this.client.client.subscribeToWorkflowEvents({
          workflowRunId,
        });

        return listener;
      } catch (e: any) {
        retries += 1;
      }
    }

    throw new HatchetError(
      `Could not subscribe to the worker after ${DEFAULT_EVENT_LISTENER_RETRY_COUNT} retries`
    );
  }

  async getWorkflowRun(workflowRunId: string) {
    try {
      const res = await this.client.api.workflowRunGet(this.client.config.tenant_id, workflowRunId);

      const stepRuns = res.data.jobRuns?.[0]?.stepRuns ?? [];
      const stepRunOutput = stepRuns.reduce((acc: Record<string, any>, stepRun) => {
        acc[stepRun.step?.readableId || ''] = JSON.parse(stepRun.output || '{}');
        return acc;
      }, {});

      if (Object.keys(workflowStatusMap).includes(res.data.status)) {
        const type = workflowStatusMap[res.data.status];
        if (!type) return undefined;
        return {
          type,
          payload: JSON.stringify(stepRunOutput),
        };
      }

      return undefined;
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  async polling(workflowRunId: string) {
    this.pollInterval = setInterval(async () => {
      try {
        const result = await this.getWorkflowRun(workflowRunId);
        if (result) {
          this.emit(result);
          this.close();
        }
      } catch (e: any) {
        // TODO error handling
      }
    }, DEFAULT_EVENT_LISTENER_POLL_INTERVAL);
  }

  close() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  async *stream(): AsyncGenerator<StepRunEvent, void, unknown> {
    for await (const _ of on(this.eventEmitter, 'event')) {
      while (this.q.length > 0) {
        const r = this.q.shift();
        if (r) {
          yield r;
        }
      }
    }
  }
}

export class ListenerClient {
  config: ClientConfig;
  client: PbDispatcherClient;
  logger: Logger;
  api: Api;

  constructor(config: ClientConfig, channel: Channel, factory: ClientFactory, api: Api) {
    this.config = config;
    this.client = factory.create(DispatcherDefinition, channel);
    this.logger = new Logger(`Listener`, config.log_level);
    this.api = api;
  }

  get(workflowRunId: string) {
    const listener = new PollingAsyncListener(workflowRunId, this);
    return listener;
  }

  async stream(workflowRunId: string): Promise<AsyncGenerator<StepRunEvent, void, unknown>> {
    return this.get(workflowRunId).stream();
  }
}
