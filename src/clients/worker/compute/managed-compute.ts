import { HatchetClient } from '@clients/hatchet-client';
import {
  CreateManagedWorkerRuntimeConfigRequest,
  InfraAsCodeRequest,
} from '@hatchet/clients/rest/generated/cloud/data-contracts';
import { Logger } from '@hatchet/util/logger';
import { computeHash } from './compute-config';
import { ActionRegistry } from '../worker';

export class ManagedCompute {
  actions: ActionRegistry;
  client: HatchetClient;
  maxRuns: number;
  configs: CreateManagedWorkerRuntimeConfigRequest[];
  cloudRegisterId: string | undefined;
  logger: Logger;

  constructor(actions: ActionRegistry, client: HatchetClient, maxRuns: number = 1) {
    this.actions = actions;
    this.client = client;
    this.maxRuns = maxRuns;
    this.configs = this.getComputeConfigs(this.actions);
    this.cloudRegisterId = this.client.config.cloud_register_id;

    this.logger = new Logger(`Compute`, this.client.config.log_level);

    if (this.configs.length === 0) {
      this.logger.debug(
        'No compute configs found, skipping cloud registration and running all actions locally.'
      );
      return;
    }

    if (!this.cloudRegisterId) {
      this.logger.warn('Managed cloud compute plan:');
      this.configs.forEach((compute) => {
        this.logger.warn('    ----------------------------');
        this.logger.warn(`    actions: ${compute.actions?.join(', ')}`);
        this.logger.warn(`    num replicas: ${compute.numReplicas}`);
        this.logger.warn(`    cpu kind: ${compute.cpuKind}`);
        this.logger.warn(`    cpus: ${compute.cpus}`);
        this.logger.warn(`    memory mb: ${compute.memoryMb}`);
        // this.logger.warn(`    regions: ${compute.regions?.join(', ')}`);
      });

      this.logger.warn(
        'NOTICE: local mode detected, skipping cloud registration and running all actions locally.'
      );
    }
  }

  getComputeConfigs(actions: ActionRegistry): CreateManagedWorkerRuntimeConfigRequest[] {
    /**
     * Builds a map of compute hashes to compute configs and lists of actions that correspond to each compute hash.
     */
    const computeMap: Record<string, CreateManagedWorkerRuntimeConfigRequest> = {};

    try {
      Object.entries(actions).forEach(([action, { compute }]) => {
        if (!compute) {
          return;
        }

        const key = computeHash(compute);

        const gpuKind = 'gpuKind' in compute ? compute.gpuKind : undefined;
        const gpus = 'gpus' in compute ? compute.gpus : undefined;

        if (!computeMap[key]) {
          computeMap[key] = {
            actions: [],
            numReplicas: compute.numReplicas,
            cpuKind: compute.cpuKind!,
            cpus: compute.cpus,
            memoryMb: compute.memoryMb,
            regions: compute.regions,
            slots: this.maxRuns,
            gpuKind,
            gpus,
          };
        }

        computeMap[key].actions!.push(action);
      });

      return Object.values(computeMap);
    } catch (e: any) {
      this.logger.error(`Error getting compute configs: ${e}`);
      return [];
    }
  }

  async cloudRegister(): Promise<void> {
    /**
     * Registers the compute plan with the cloud if the environment variable is set.
     * Exits the process upon completion.
     */
    if (this.cloudRegisterId) {
      this.logger.info(`Registering cloud compute plan with ID: ${this.cloudRegisterId}`);

      try {
        if (this.configs.length === 0) {
          this.logger.warn('No actions to register, skipping cloud registration.');
          process.exit(0);
        }

        const req: InfraAsCodeRequest = {
          runtimeConfigs: this.configs,
        };

        await this.client.cloudApi.infraAsCodeCreate(this.cloudRegisterId, req);

        process.exit(0);
      } catch (e: any) {
        this.logger.error(`ERROR: ${e}`);
        process.exit(1);
      }
    }
  }
}
