import Hatchet from '../sdk';
import { Workflow } from '../workflow';

const hatchet = Hatchet.init();

export interface TimedResponse {
  time: number;
}


const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const priorityWorkflow1: Workflow = {
  id: 'priority-1-workflow',
  description: 'test',
  on: {
    event: 'user:create',
  },
  defaultPriority: 1,
  steps: [
    {
      name: 'step1',
      run: async (ctx) => {
        console.log('starting step1 with the following input', ctx.workflowInput());
        console.log('waiting 2 seconds...');
        await sleep(2000);
        ctx.putStream('step1 stream');
        console.log('executed step1!');
        return { time: Date.now() };
      },
    },
  ],
};
export const priorityWorkflow2: Workflow = {
  id: 'priority-2-workflow',
  description: 'test',
  on: {
    event: 'user:create',
  },
  defaultPriority: 2,
  steps: [
    {
      name: 'step1',
      run: async (ctx) => {
        console.log('starting step1 with the following input', ctx.workflowInput());
        console.log('waiting 2 seconds...');
        await sleep(2000);
        ctx.putStream('step1 stream');
        console.log('executed step1!');
        return { time: Date.now() };
      },
    },
  ],
};

async function main() {
  const worker = await hatchet.worker('example-priority-worker', {
    maxRuns: 1,
  });
  await worker.registerWorkflow(priorityWorkflow1);
  await worker.registerWorkflow(priorityWorkflow2);
  worker.start();
}

main();
