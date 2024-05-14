import Hatchet from '../src/sdk';
import { Workflow } from '../src/workflow';

const hatchet = Hatchet.init();

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const workflow: Workflow = {
  id: 'simple-workflow-pen',
  description: 'test',
  on: {
    event: 'user:create',
  },
  steps: [
    {
      name: 'step1',
      retries: 2,
      timeout: '10s',
      run: async (ctx) => {
        console.log('RESOURCE INTENSIVE PROCESS...');

        try {

          ctx.controller.signal.addEventListener('abort', () => {
            throw new Error('ABORTED IMMEDIATELY!');
          });
        } catch (e) {
          console.log('error', e);
        }


        await sleep(11_000);
        console.log('check abort')
        if (ctx.controller.signal.aborted) {
          console.log('ABORTED!');
          throw new Error('ABORTED!');
        }

        // await ctx.releaseSlot();
        await sleep(10_000);
        console.log('executed step1!');
        return { step1: 'step1 results!' };
      },
    },
    {
      name: 'step1a',
      retries: 2,
      timeout: '10s',
      run: async (ctx) => {
        console.log('RESOURCE INTENSIVE PROCESS...');
        await sleep(5000);
        // await ctx.releaseSlot();
        await sleep(60_000);
        console.log('executed step1!');
        return { step1: 'step1 results!' };
      },
    },
    {
      name: 'step2',
      parents: ['step1'],
      run: (ctx) => {
        console.log('executed step2 after step1 returned ', ctx.stepOutput('step1'));
        return { step2: 'step2 results!' };
      },
    },
  ],
};

async function main() {
  const worker = await hatchet.worker('example-worker', 5);
  await worker.registerWorkflow(workflow);
  worker.start();
}

main();
