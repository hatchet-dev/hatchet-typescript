import { Workflow, Worker } from '../src';
import sleep from '../src/util/sleep';
import Hatchet from '../src/sdk';

describe('e2e', () => {
  let hatchet: Hatchet;
  let worker: Worker;

  beforeEach(async () => {
    hatchet = Hatchet.init();
    worker = await hatchet.worker('example-worker');
  });

  afterEach(async () => {
    await worker.stop();
    await sleep(2000);
  });

  it('should pass a simple workflow', async () => {
    let invoked = 0;

    const workflow: Workflow = {
      id: 'simple-e2e-workflow',
      description: 'test',
      on: {
        event: 'user:create',
      },
      steps: [
        {
          name: 'step1',
          run: async (ctx) => {
            console.log('starting step1 with the following input', ctx.workflowInput());
            invoked += 1;
            return { step1: 'step1 results!' };
          },
        },
        {
          name: 'step2',
          parents: ['step1'],
          run: (ctx) => {
            console.log('executed step2 after step1 returned ', ctx.stepOutput('step1'));
            invoked += 1;
            return { step2: 'step2 results!' };
          },
        },
      ],
    };

    console.log('registering workflow...');
    await worker.registerWorkflow(workflow);

    void worker.start();

    console.log('worker started.');

    await sleep(5000);

    console.log('pushing event...');

    await hatchet.event.push('user:create', {
      test: 'test',
    });

    await sleep(2000);

    console.log('invoked', invoked);

    expect(invoked).toEqual(2);
  }, 60000);
});
