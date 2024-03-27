import { Workflow, Worker } from '../src';
import sleep from '../src/util/sleep';
import Hatchet from '../src/sdk';

describe('fanout-e2e', () => {
  let hatchet: Hatchet;
  let worker: Worker;

  beforeEach(async () => {
    hatchet = Hatchet.init();
    worker = await hatchet.worker('fanout-worker');
  });

  afterEach(async () => {
    await worker.stop();
    await sleep(2000);
  });

  it('should pass a fanout workflow', async () => {
    let invoked = 0;
    const start = new Date();
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
            invoked += 1;
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
            await sleep(1000);
            invoked += 1;
            console.log('child workflow input:', input);
            return { 'child-output': 'results' };
          },
        },
      ],
    };

    console.log('registering workflow...');
    await worker.registerWorkflow(parentWorkflow);
    await worker.registerWorkflow(childWorkflow);

    void worker.start();

    console.log('worker started.');

    await sleep(5000);

    console.log('pushing event...');

    await hatchet.admin.run_workflow('parent-workflow', { input: 'parent-input' });

    // TODO we should likely return a ChildWorkflowRef from run_workflow...?

    await sleep(10000);

    console.log('invoked', invoked);

    expect(invoked).toEqual(2);

    await worker.stop();
  }, 120000);
});
