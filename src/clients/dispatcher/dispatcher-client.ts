import { Channel, ClientFactory } from 'nice-grpc';
import {
  DispatcherClient as PbDispatcherClient,
  DispatcherDefinition,
  StepActionEvent,
  GroupKeyActionEvent,
  OverridesData,
  DeepPartial,
  WorkerAffinityConfig as PbWorkerAffinityConfig,
  WorkerAffinityComparator,
} from '@hatchet/protoc/dispatcher';
import { ClientConfig } from '@clients/hatchet-client/client-config';
import HatchetError from '@util/errors/hatchet-error';
import { Logger } from '@hatchet/util/logger';

import { retrier } from '@hatchet/util/retrier';
import { ActionListener } from './action-listener';

/**
 * Configuration for worker affinity settings.
 */
export interface WorkerAffinityConfig {
  /**
   * The initial value for the affinity setting. This can be a string or a number.
   */
  value: string | number;

  /**
   * (Optional) Specifies whether the affinity setting is required.
   * If required, the worker will not accept actions that do not have a truthy affinity setting.
   *
   * Defaults to false.
   */
  required?: boolean;

  /**
   * (Optional) The weight assigned to the affinity setting. Higher weights indicate higher priority.
   *
   * Defaults to 100 if not specified.
   */
  weight?: number;

  /**
   * (Optional) The comparator used for evaluating the affinity setting.
   * Supported values are 'EQUALS' and 'NOT_EQUALS'.
   *
   * Defaults to 'EQUALS' if not specified.
   */
  comparator?: WorkerAffinityComparator;
}

interface GetActionListenerOptions {
  workerName: string;
  services: string[];
  actions: string[];
  maxRuns?: number;
  affinities: Record<string, WorkerAffinityConfig>;
}

export class DispatcherClient {
  config: ClientConfig;
  client: PbDispatcherClient;
  logger: Logger;

  constructor(config: ClientConfig, channel: Channel, factory: ClientFactory) {
    this.config = config;
    this.client = factory.create(DispatcherDefinition, channel);
    this.logger = new Logger(`Dispatcher`, config.log_level);
  }

  async getActionListener(options: GetActionListenerOptions) {
    const affinities = mapAffinityConfig(options.affinities);

    this.logger.error(`Registering worker with affinities:${affinities}`);

    // Register the worker
    const registration = await this.client.register({
      ...options,
      workerAffinities: affinities,
    });

    return new ActionListener(this, registration.workerId);
  }

  async sendStepActionEvent(in_: StepActionEvent) {
    try {
      return await retrier(async () => this.client.sendStepActionEvent(in_), this.logger);
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  async sendGroupKeyActionEvent(in_: GroupKeyActionEvent) {
    try {
      return await retrier(async () => this.client.sendGroupKeyActionEvent(in_), this.logger);
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  async putOverridesData(in_: DeepPartial<OverridesData>) {
    return retrier(async () => this.client.putOverridesData(in_), this.logger).catch((e) => {
      this.logger.warn(`Could not put overrides data: ${e.message}`);
    });
  }

  async refreshTimeout(incrementTimeoutBy: string, stepRunId: string) {
    try {
      return this.client.refreshTimeout({
        stepRunId,
        incrementTimeoutBy,
      });
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  async upsertAffinityConfig(workerId: string, config: Record<string, WorkerAffinityConfig>) {
    const workerAffinities = mapAffinityConfig(config);
    try {
      return await this.client.upsertWorkerAffinities({
        workerId,
        workerAffinities,
      });
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }
}

function mapAffinityConfig(
  in_: Record<string, WorkerAffinityConfig>
): Record<string, PbWorkerAffinityConfig> {
  return Object.entries(in_).reduce<Record<string, PbWorkerAffinityConfig>>(
    (acc, [key, value]) => ({
      ...acc,
      [key]: {
        strValue: typeof value.value === 'string' ? value.value : undefined,
        intValue: typeof value.value === 'number' ? value.value : undefined,
        required: value.required,
        weight: value.weight,
        comparator: value.comparator,
      } as PbWorkerAffinityConfig,
    }),
    {} as Record<string, PbWorkerAffinityConfig>
  );
}
