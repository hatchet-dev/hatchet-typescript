import Hatchet from '../src/sdk';
import { Workflow } from '../src/workflow';

const hatchet = Hatchet.init({
  log_level: 'OFF',
});

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const workflow: Workflow = {
  id: 'on-failure-example',
  description: 'test',
  on: {
    event: 'user:create',
  },
  steps: [
    {
      name: 'dag-step1',
      run: async (ctx) => {
        console.log('Starting Step 1!');
        await sleep(1000);
        throw new Error('Step 1 failed');
      },
    },
  ],
  onFailure: {
    name: 'on-failure-step',
    run: async (ctx) => {
      console.log('Starting On Failure Step!');
      return { onFailure: 'step' };
    },
  },
};

async function main() {
  const worker = await hatchet.worker('example-worker', 1);
  await worker.registerWorkflow(workflow);
  worker.start();
}

main();
