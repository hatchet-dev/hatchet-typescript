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
        const res = await ctx
          .spawnWorfklow<string>('child-workflow', { input: 'child-input' })
          .result();

        console.log('spawned workflow result:', res);

        return { spawned: [res] };
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
        await sleep(3000);
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
