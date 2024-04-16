import { DispatcherClient as PbDispatcherClient, AssignedAction } from '@hatchet/protoc/dispatcher';

import { Status } from 'nice-grpc';
import { ClientConfig } from '@clients/hatchet-client/client-config';
import sleep from '@util/sleep';
import HatchetError from '@util/errors/hatchet-error';
import { Logger } from '@hatchet/util/logger';

import { DispatcherClient } from './dispatcher-client';

const DEFAULT_ACTION_LISTENER_RETRY_INTERVAL = 5000; // milliseconds
const DEFAULT_ACTION_LISTENER_RETRY_COUNT = 20;

// eslint-disable-next-line no-shadow
enum ListenStrategy {
  LISTEN_STRATEGY_V1 = 1,
  LISTEN_STRATEGY_V2 = 2,
}

export interface Action {
  tenantId: string;
  jobId: string;
  jobName: string;
  jobRunId: string;
  stepId: string;
  stepRunId: string;
  actionId: string;
  actionType: number;
  actionPayload: string;
  workflowRunId: string;
  getGroupKeyRunId: string;
  stepName: string;
}

export class ActionListener {
  config: ClientConfig;
  client: PbDispatcherClient;
  workerId: string;
  logger: Logger;
  lastConnectionAttempt: number = 0;
  retries: number = 0;
  retryInterval: number = DEFAULT_ACTION_LISTENER_RETRY_INTERVAL;
  retryCount: number = DEFAULT_ACTION_LISTENER_RETRY_COUNT;
  done = false;
  listenStrategy = ListenStrategy.LISTEN_STRATEGY_V2;
  heartbeatInterval: any;

  constructor(
    client: DispatcherClient,
    workerId: string,
    retryInterval: number = DEFAULT_ACTION_LISTENER_RETRY_INTERVAL,
    retryCount: number = DEFAULT_ACTION_LISTENER_RETRY_COUNT
  ) {
    this.config = client.config;
    this.client = client.client;
    this.workerId = workerId;
    this.logger = new Logger(`ActionListener`, this.config.log_level);
    this.retryInterval = retryInterval;
    this.retryCount = retryCount;
  }

  actions = () =>
    (async function* gen(client: ActionListener) {
      while (true) {
        if (client.done) {
          break;
        }

        try {
          const listenClient = await client.getListenClient();

          for await (const assignedAction of listenClient) {
            const action: Action = {
              ...assignedAction,
            };

            yield action;
          }
        } catch (e: any) {
          client.logger.info('Listener error');

          // if this is a HatchetError, we should throw this error
          if (e instanceof HatchetError) {
            throw e;
          }

          if (
            (await client.getListenStrategy()) === ListenStrategy.LISTEN_STRATEGY_V2 &&
            e.code === Status.UNIMPLEMENTED
          ) {
            client.setListenStrategy(ListenStrategy.LISTEN_STRATEGY_V1);
          }

          client.incrementRetries();
          client.logger.error(`Listener encountered an error: ${e.message}`);
          client.logger.info(`Retrying in ${client.retryInterval}ms...`);
          await sleep(client.retryInterval);
        }
      }
    })(this);
  async setListenStrategy(strategy: ListenStrategy) {
    this.listenStrategy = strategy;
  }

  async getListenStrategy(): Promise<ListenStrategy> {
    return this.listenStrategy;
  }

  async incrementRetries() {
    this.retries += 1;
  }

  async heartbeat() {
    if (this.heartbeatInterval) {
      return;
    }

    const beat = async () => {
      try {
        await this.client.heartbeat({
          workerId: this.workerId,
          heartbeatAt: new Date(),
        });
      } catch (e: any) {
        if (e.code === Status.UNIMPLEMENTED) {
          // break out of interval
          this.closeHeartbeat();
          return;
        }

        this.logger.error(`Failed to send heartbeat: ${e.message}`);
      }
    };

    // start with a heartbeat
    beat();
    this.heartbeatInterval = setInterval(beat, 4000);
  }

  closeHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }

  async getListenClient(): Promise<AsyncIterable<AssignedAction>> {
    const currentTime = Math.floor(Date.now());

    // attempt to account for the time it takes to establish the listener
    if (currentTime - this.lastConnectionAttempt > this.retryInterval * 4) {
      this.retries = 0;
    }

    this.lastConnectionAttempt = currentTime;

    if (this.retries > DEFAULT_ACTION_LISTENER_RETRY_COUNT) {
      throw new HatchetError(
        `Could not subscribe to the worker after ${DEFAULT_ACTION_LISTENER_RETRY_COUNT} retries`
      );
    }

    this.logger.info(
      `Connecting to Hatchet to establish listener for actions... ${this.retries}/${DEFAULT_ACTION_LISTENER_RETRY_COUNT} (last attempt: ${this.lastConnectionAttempt})`
    );

    if (this.retries >= 1) {
      await sleep(DEFAULT_ACTION_LISTENER_RETRY_INTERVAL);
    }

    try {
      if (this.listenStrategy === ListenStrategy.LISTEN_STRATEGY_V1) {
        const result = this.client.listen({
          workerId: this.workerId,
        });
        this.logger.info('Connection established using LISTEN_STRATEGY_V1');
        return result;
      }

      const res = this.client.listenV2({
        workerId: this.workerId,
      });

      this.heartbeat();
      this.logger.info('Connection established using LISTEN_STRATEGY_V2');
      return res;
    } catch (e: any) {
      this.retries += 1;
      this.logger.error(`Attempt ${this.retries}: Failed to connect, retrying...`);

      if (e.code === Status.UNAVAILABLE) {
        // Connection lost, reset heartbeat interval and retry connection
        this.closeHeartbeat();
        return this.getListenClient();
      }

      throw e;
    }
  }

  async unregister() {
    this.done = true;
    this.closeHeartbeat();
    try {
      return this.client.unsubscribe({
        workerId: this.workerId,
      });
    } catch (e: any) {
      throw new HatchetError(`Failed to unsubscribe: ${e.message}`);
    }
  }
}
