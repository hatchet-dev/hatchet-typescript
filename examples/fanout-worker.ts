import Hatchet from '../src/sdk';
import { Workflow } from '../src/workflow';

const hatchet = Hatchet.init();

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const parentWorkflow: Workflow = {
  id: 'parent-workflow',
  description: 'simple example for spawning child workflows',
  on: {
    event: 'fanout:create',
  },
  steps: [
    {
      name: 'parent-spawn',
      timeout: '10s',
      run: async (ctx) => {
        const promises = Array.from({ length: 7 }, (_, i) =>
          ctx.spawnWorkflow<string>('child-workflow', { input: `child-input-${i}` }).result()
        );

        const results = await Promise.all(promises);
        console.log('spawned workflow results:', results);
        console.log('number of spawned workflows:', results.length);
        return { spawned: results };
      },
    },
  ],
};

const childWorkflow: Workflow = {
  id: 'child-workflow',
  description: 'simple example for spawning child workflows',
  on: {
    event: 'fanout:create',
  },
  steps: [
    {
      name: 'child-work',
      run: async (ctx) => {
        const { input } = ctx.workflowInput();
        await sleep(100);
        // throw new Error('child error');
        console.log('child workflow input:', input);
        return { 'child-output': 'results' };
      },
    },
  ],
};

async function main() {
  const worker = await hatchet.worker('fanout-worker');
  await worker.registerWorkflow(parentWorkflow);
  await worker.registerWorkflow(childWorkflow);
  worker.start();
}

main();
