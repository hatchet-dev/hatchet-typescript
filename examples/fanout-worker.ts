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
      run: async (ctx) => {
        const res = await ctx.spawnWorfklow(
          'child-workflow', 
          { input: 'child-input' });

          const res2 = await ctx.spawnWorfklow(
            'child-workflow', 
            { input: 'child-input' });
        return { spawned: [res, res2] }
      },
    }
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
      name: 'parent-spawn',
      run: async (ctx) => {
        const { input } = ctx.workflowInput();
        console.log('child workflow input:', input);
        return {}
      },
    }
  ],
};

async function main() {
  const worker = await hatchet.worker('fanout-worker');
  await worker.registerWorkflow(parentWorkflow);
  await worker.registerWorkflow(childWorkflow);
  worker.start();
}

main();
