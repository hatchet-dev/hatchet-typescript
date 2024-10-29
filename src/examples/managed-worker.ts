import { SharedCPUCompute } from '@hatchet/clients/worker/compute/compute-config';
import { ManagedWorkerRegion } from '@hatchet/clients/rest/generated/cloud/data-contracts';
import Hatchet from '../sdk';
import { Workflow } from '../workflow';

const hatchet = Hatchet.init();

const oneCpuWorkerConfig: SharedCPUCompute = {
  cpuKind: 'shared',
  memoryMb: 1024,
  numReplicas: 1,
  cpus: 1,
  regions: [ManagedWorkerRegion.Ewr],
};

const twoCpuWorkerConfig: SharedCPUCompute = {
  cpuKind: 'shared',
  memoryMb: 1024,
  numReplicas: 1,
  cpus: 2,
  regions: [ManagedWorkerRegion.Ewr],
};

const workflow: Workflow = {
  id: 'simple-workflow',
  description: 'test',
  on: {
    event: 'user:create',
  },
  steps: [
    {
      name: 'step1',
      compute: oneCpuWorkerConfig,
      run: async (ctx) => {
        console.log('executed step1!');
        return { step1: 'step1 results!' };
      },
    },
    {
      name: 'step2',
      parents: ['step1'],
      compute: twoCpuWorkerConfig,
      run: (ctx) => {
        console.log('executed step2 after step1 returned ', ctx.stepOutput('step1'));
        return { step2: 'step2 results!' };
      },
    },
  ],
};

async function main() {
  const worker = await hatchet.worker('managed-worker');
  await worker.registerWorkflow(workflow);
  worker.start();
}

main();
