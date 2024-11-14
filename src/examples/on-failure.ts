import Hatchet from '../sdk';
import { Workflow } from '../workflow';

const hatchet = Hatchet.init();

// ❓ OnFailure Step
// This workflow will fail because the step will throw an error
// we define an onFailure step to handle this case
const workflow: Workflow = {
  // ... normal workflow definition
  id: 'on-failure-example',
  description: 'test',
  on: {
    event: 'user:create',
  },
  // ,
  steps: [
    {
      name: 'step1',
      run: async (ctx) => {
        // 👀 this step will always throw an error
        throw new Error('Step 1 failed');
      },
    },
  ],
  // 👀 After the workflow fails, this special step will run
  onFailure: {
    name: 'on-failure-step',
    run: async (ctx) => {
      return { onFailure: 'step' };
    },
  },
};
// ‼️

async function main() {
  const worker = await hatchet.worker('example-worker', 1);
  await worker.registerWorkflow(workflow);
  worker.start();
}

main();
