import { HatchetLogger } from '@hatchet/util/logger';
import { DispatcherClient as PbDispatcherClient } from '@hatchet/protoc/dispatcher';
import { Worker } from 'worker_threads';
import path from 'path';
import { runThreaded } from '@hatchet/util/thread-helper';
import { ClientConfig } from '../../hatchet-client';
import { DispatcherClient } from '../dispatcher-client';

export class Heartbeat {
  config: ClientConfig;
  client: PbDispatcherClient;
  workerId: string;
  logger: HatchetLogger;

  heartbeatWorker: Worker | undefined;

  constructor(client: DispatcherClient, workerId: string) {
    this.config = client.config;
    this.client = client.client;
    this.workerId = workerId;
    this.logger = new HatchetLogger(`HeartbeatController`, this.config.log_level);
  }

  async start() {
    if (!this.heartbeatWorker) {
      this.heartbeatWorker = runThreaded(path.join(__dirname, './heartbeat-worker'), {
        workerData: {
          config: this.config,
          workerId: this.workerId,
        },
      });
    }
  }

  async stop() {
    this.heartbeatWorker?.postMessage('stop');
    this.heartbeatWorker?.terminate();
    this.heartbeatWorker = undefined;
  }
}
