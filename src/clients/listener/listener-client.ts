import { Channel, ClientFactory, Status } from 'nice-grpc';
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

const DEFAULT_ACTION_LISTENER_RETRY_INTERVAL = 5; // seconds
const DEFAULT_ACTION_LISTENER_RETRY_COUNT = 5;

// eslint-disable-next-line no-shadow
export enum RunEventType {
  STEP_RUN_EVENT_TYPE_STARTED = 'STEP_RUN_EVENT_TYPE_STARTED',
  STEP_RUN_EVENT_TYPE_COMPLETED = 'STEP_RUN_EVENT_TYPE_COMPLETED',
  STEP_RUN_EVENT_TYPE_FAILED = 'STEP_RUN_EVENT_TYPE_FAILED',
  STEP_RUN_EVENT_TYPE_CANCELLED = 'STEP_RUN_EVENT_TYPE_CANCELLED',
  STEP_RUN_EVENT_TYPE_TIMED_OUT = 'STEP_RUN_EVENT_TYPE_TIMED_OUT',
  WORKFLOW_RUN_EVENT_TYPE_STARTED = 'WORKFLOW_RUN_EVENT_TYPE_STARTED',
  WORKFLOW_RUN_EVENT_TYPE_COMPLETED = 'WORKFLOW_RUN_EVENT_TYPE_COMPLETED',
  WORKFLOW_RUN_EVENT_TYPE_FAILED = 'WORKFLOW_RUN_EVENT_TYPE_FAILED',
  WORKFLOW_RUN_EVENT_TYPE_CANCELLED = 'WORKFLOW_RUN_EVENT_TYPE_CANCELLED',
  WORKFLOW_RUN_EVENT_TYPE_TIMED_OUT = 'WORKFLOW_RUN_EVENT_TYPE_TIMED_OUT',
}

export interface StepRunEvent {
  type: RunEventType;
  payload: string;
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

  async getWorkflowRun(workflowRunId: string) {
    try {
      const res = await this.api.workflowRunGet(this.config.tenant_id, workflowRunId);

      const stepRuns = res.data.jobRuns?.[0]?.stepRuns ?? [];

      if (res.data.status === WorkflowRunStatus.SUCCEEDED) {
        const stepRunOutput = stepRuns.reduce((acc: Record<string, any>, stepRun) => {
          acc[stepRun.step?.readableId || ''] = JSON.parse(stepRun.output || '{}');
          return acc;
        }, {});

        return {
          type: RunEventType.WORKFLOW_RUN_EVENT_TYPE_COMPLETED,
          payload: JSON.stringify(stepRunOutput),
        };
      }
      return undefined;
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  async *stream(workflowRunId: string) {
    let listener = this.client.subscribeToWorkflowEvents({
      workflowRunId,
    });

    const res = await this.getWorkflowRun(workflowRunId);

    if (res) {
      yield res;
    }

    try {
      for await (const workflowEvent of listener) {
        const stepEventTypeMap: Record<ResourceEventType, RunEventType | undefined> = {
          [ResourceEventType.RESOURCE_EVENT_TYPE_STARTED]: RunEventType.STEP_RUN_EVENT_TYPE_STARTED,
          [ResourceEventType.RESOURCE_EVENT_TYPE_COMPLETED]:
            RunEventType.STEP_RUN_EVENT_TYPE_COMPLETED,
          [ResourceEventType.RESOURCE_EVENT_TYPE_FAILED]: RunEventType.STEP_RUN_EVENT_TYPE_FAILED,
          [ResourceEventType.RESOURCE_EVENT_TYPE_CANCELLED]:
            RunEventType.STEP_RUN_EVENT_TYPE_CANCELLED,
          [ResourceEventType.RESOURCE_EVENT_TYPE_TIMED_OUT]:
            RunEventType.STEP_RUN_EVENT_TYPE_TIMED_OUT,
          [ResourceEventType.RESOURCE_EVENT_TYPE_UNKNOWN]: undefined,
          [ResourceEventType.UNRECOGNIZED]: undefined,
        };

        const workflowEventTypeMap: Record<ResourceEventType, RunEventType | undefined> = {
          [ResourceEventType.RESOURCE_EVENT_TYPE_STARTED]:
            RunEventType.WORKFLOW_RUN_EVENT_TYPE_STARTED,
          [ResourceEventType.RESOURCE_EVENT_TYPE_COMPLETED]:
            RunEventType.WORKFLOW_RUN_EVENT_TYPE_COMPLETED,
          [ResourceEventType.RESOURCE_EVENT_TYPE_FAILED]:
            RunEventType.WORKFLOW_RUN_EVENT_TYPE_FAILED,
          [ResourceEventType.RESOURCE_EVENT_TYPE_CANCELLED]:
            RunEventType.WORKFLOW_RUN_EVENT_TYPE_CANCELLED,
          [ResourceEventType.RESOURCE_EVENT_TYPE_TIMED_OUT]:
            RunEventType.WORKFLOW_RUN_EVENT_TYPE_TIMED_OUT,
          [ResourceEventType.RESOURCE_EVENT_TYPE_UNKNOWN]: undefined,
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

        const eventType = resourceTypeMap[workflowEvent.resourceType]?.[workflowEvent.eventType];

        if (eventType) {
          if (eventType === RunEventType.WORKFLOW_RUN_EVENT_TYPE_COMPLETED) {
            // OPTIMZATION - consider including the workflow run data in the event?
            const data = await this.getWorkflowRun(workflowRunId);
            if (data) {
              yield data;
            }
          } else {
            yield {
              type: eventType,
              payload: workflowEvent.eventPayload,
            };
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
  }

  async retrySubscribe(workflowRunId: string) {
    let retries = 0;

    while (retries < DEFAULT_ACTION_LISTENER_RETRY_COUNT) {
      try {
        await sleep(DEFAULT_ACTION_LISTENER_RETRY_INTERVAL);

        const listener = this.client.subscribeToWorkflowEvents({
          workflowRunId,
        });

        return listener;
      } catch (e: any) {
        retries += 1;
      }
    }

    throw new HatchetError(
      `Could not subscribe to the worker after ${DEFAULT_ACTION_LISTENER_RETRY_COUNT} retries`
    );
  }
}
