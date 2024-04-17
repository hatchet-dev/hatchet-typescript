// eslint-disable-next-line max-classes-per-file
import { Channel, ClientFactory, Status } from 'nice-grpc';
import { EventEmitter } from 'events';
import {
  DispatcherClient as PbDispatcherClient,
  DispatcherDefinition,
  WorkflowRunEvent,
  SubscribeToWorkflowRunsRequest,
  WorkflowRunEventType,
} from '@hatchet/protoc/dispatcher';
import { ClientConfig } from '@clients/hatchet-client/client-config';
import { Logger } from '@hatchet/util/logger';
import sleep from '@hatchet/util/sleep';
import { Api } from '../rest';

const DEFAULT_EVENT_LISTENER_RETRY_INTERVAL = 5; // seconds
const DEFAULT_EVENT_LISTENER_RETRY_COUNT = 5;

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
export interface StepRunEvent {
  type: RunEventType;
  payload: string;
}

export class Streamable {
  listener: AsyncIterable<WorkflowRunEvent>;
  id: string;

  responseEmitter = new EventEmitter();

  constructor(listener: AsyncIterable<WorkflowRunEvent>, id: string) {
    this.listener = listener;
    this.id = id;
  }

  async *stream(): AsyncGenerator<WorkflowRunEvent, void, unknown> {
    while (true) {
      const req: WorkflowRunEvent = await new Promise((resolve) => {
        this.responseEmitter.once('response', resolve);
      });
      yield req;
    }
  }
}

export class GrpcPooledListener {
  listener: AsyncIterable<WorkflowRunEvent> | undefined;
  requestEmitter = new EventEmitter();
  client: ListenerClient;

  subscribers: Record<string, Streamable> = {};

  constructor(client: ListenerClient) {
    this.client = client;
    this.init();
  }

  private async init(retries = 0) {
    if (retries > DEFAULT_EVENT_LISTENER_RETRY_COUNT) return;
    if (retries > 0) {
      console.log('retrying');
      await sleep(DEFAULT_EVENT_LISTENER_RETRY_INTERVAL * 1000);
    }

    try {
      this.client.logger.debug('Initializing listener');
      this.listener = this.client.client.subscribeToWorkflowRuns(this.request());

      for await (const event of this.listener) {
        const emitter = this.subscribers[event.workflowRunId];
        if (emitter) {
          emitter.responseEmitter.emit('response', event);
          if (event.eventType === WorkflowRunEventType.WORKFLOW_RUN_EVENT_TYPE_FINISHED) {
            delete this.subscribers[event.workflowRunId];
          }
        }
      }
    } catch (e: any) {
      if (e.code === Status.CANCELLED) {
        return;
      }
      if (e.code === Status.UNAVAILABLE) {
        await this.init(retries + 1);
        return;
      }

      await this.init(retries + 1);
    }
    // TODO cleanup reconnect
    console.log('reconnecting');
  }

  subscribe(request: SubscribeToWorkflowRunsRequest) {
    if (!this.listener) throw new Error('listener not initialized');

    this.subscribers[request.workflowRunId] = new Streamable(this.listener, request.workflowRunId);
    this.requestEmitter.emit('subscribe', request);
    return this.subscribers[request.workflowRunId];
  }

  private async *request(): AsyncIterable<SubscribeToWorkflowRunsRequest> {
    while (true) {
      const req: SubscribeToWorkflowRunsRequest = await new Promise((resolve) => {
        this.requestEmitter.once('subscribe', resolve);
      });
      yield req;
    }
  }
}

export class ListenerClient {
  config: ClientConfig;
  client: PbDispatcherClient;
  logger: Logger;
  api: Api;

  cache: GrpcPooledListener;

  constructor(config: ClientConfig, channel: Channel, factory: ClientFactory, api: Api) {
    this.config = config;
    this.client = factory.create(DispatcherDefinition, channel, {});
    this.logger = new Logger(`Listener`, config.log_level);
    this.api = api;
    this.cache = new GrpcPooledListener(this);
  }

  get(workflowRunId: string): Streamable {
    const listener = this.cache.subscribe({
      workflowRunId,
    });
    return listener;
  }

  stream(workflowRunId: string): AsyncGenerator<WorkflowRunEvent, void, unknown> {
    return this.get(workflowRunId).stream();
  }
}
