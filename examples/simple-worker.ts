import Hatchet from '../src/sdk';
import { Workflow } from '../src/workflow';

const hatchet = Hatchet.init();

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const workflow: Workflow = {
  id: 'simple-workflow',
  description: 'test',
  on: {
    event: 'user:create',
  },
  steps: [
    {
      name: 'step1',
      timeout: '5s',
      retries: 3,
      run: async (ctx) => {
        console.log('starting step1 with the following input', ctx.workflowInput());
        console.log('waiting 5 seconds...');
        console.log(ctx.retryCount())
        await sleep(6000);
        ctx.putStream('step1 stream');

        if (ctx.controller.signal.aborted) {
          console.log('aborted');
          throw new Error('aborted');
        }

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
  const worker = await hatchet.worker('example-worker');
  await worker.registerWorkflow(workflow);
  worker.start();
}

main();
