// eslint-disable-next-line max-classes-per-file
import { EventEmitter, on } from 'events';
import {
  WorkflowRunEvent,
  SubscribeToWorkflowRunsRequest,
  WorkflowRunEventType,
} from '@hatchet/protoc/dispatcher';
import { isAbortError } from 'abort-controller-x';
import sleep from '@hatchet/util/sleep';
import { ListenerClient } from './listener-client';

const DEFAULT_EVENT_LISTENER_RETRY_INTERVAL = 0.5; // seconds
const DEFAULT_EVENT_LISTENER_RETRY_COUNT = 20;

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
  onFinish: () => void = () => {};

  constructor(client: ListenerClient, onFinish: () => void) {
    this.client = client;
    this.init();
    this.onFinish = onFinish;
  }

  private async init(retries = 0) {
    if (retries > DEFAULT_EVENT_LISTENER_RETRY_COUNT) return;
    if (retries > 0) {
      this.client.logger.info(`Retrying in ... ${DEFAULT_EVENT_LISTENER_RETRY_INTERVAL} seconds`);
      await sleep(DEFAULT_EVENT_LISTENER_RETRY_INTERVAL * 1000);
    }

    try {
      this.client.logger.debug('Initializing child-listener');
      this.listener = this.client.client.subscribeToWorkflowRuns(this.request(), {});

      if (retries > 0) setTimeout(() => this.replayRequests(), 100);

      for await (const event of this.listener) {
        const emitter = this.subscribers[event.workflowRunId];
        if (emitter) {
          emitter.responseEmitter.emit('response', event);

          if (event.eventType === WorkflowRunEventType.WORKFLOW_RUN_EVENT_TYPE_FINISHED) {
            delete this.subscribers[event.workflowRunId];
            if (Object.keys(this.subscribers).length === 0) {
              // FIXME it would be better to cleanup on parent complete
              this.client.logger.debug('All subscriptions finished, cleaning up listener');
              break;
            }
          }
        }
      }
    } catch (e: any) {
      if (!isAbortError(e)) {
        this.client.logger.error(`Error in child-listener: ${e.message}`);
        this.init(retries + 1);
        return;
      }
      this.client.logger.debug('Child Listener aborted');
    }

    this.onFinish();
  }

  subscribe(request: SubscribeToWorkflowRunsRequest) {
    if (!this.listener) throw new Error('listener not initialized');

    this.subscribers[request.workflowRunId] = new Streamable(this.listener, request.workflowRunId);
    this.requestEmitter.emit('subscribe', request);
    return this.subscribers[request.workflowRunId];
  }

  replayRequests() {
    const subs = Object.values(this.subscribers);
    this.client.logger.debug(`Replaying ${subs.length} requests...`);

    for (const subscriber of subs) {
      this.requestEmitter.emit('subscribe', { workflowRunId: subscriber.id });
    }
  }

  private async *request(): AsyncIterable<SubscribeToWorkflowRunsRequest> {
    for await (const e of on(this.requestEmitter, 'subscribe')) {
      yield e[0];
    }
  }
}
