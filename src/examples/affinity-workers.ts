import Hatchet from '../sdk';
import { Workflow } from '../workflow';

const hatchet = Hatchet.init();

const workflow: Workflow = {
  id: 'affinity-workflow',
  description: 'test',
  on: {
    event: 'user:create',
  },
  steps: [
    {
      name: 'step1',
      run: async (ctx) => {
        console.log('starting step1 with the following input', ctx.workflowInput());
        return { step1: 'step1 results!' };
      },
    },
  ],
};

async function main() {
  const worker1 = await hatchet.worker('affinity-worker-1', {
    affinityConfig: {
      model: {
        initialValue: '123',
        required: true,
      },
    },
  });
  await worker1.registerWorkflow(workflow);
  worker1.start();

  const worker2 = await hatchet.worker('affinity-worker-2', {
    affinityConfig: {
      model: {
        initialValue: 'abc',
        required: true,
      },
    },
  });
  await worker2.registerWorkflow(workflow);
  worker2.start();
}

main();
