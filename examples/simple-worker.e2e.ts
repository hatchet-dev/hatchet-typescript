import { Workflow } from '../src';
import sleep from '../src/util/sleep';
import Hatchet from '../src/sdk';

describe('e2e', () => {
  let hatchet: Hatchet;

  beforeEach(() => {
    hatchet = Hatchet.init();
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

    console.log('starting worker...');

    const worker = await hatchet.worker('example-worker');
    console.log('registering workflow...');
    await worker.registerWorkflow(workflow);

    console.log('worker started.');

    void worker.start();

    await sleep(5000);

    console.log('pushing event...');

    await hatchet.event.push('user:create', {
      test: 'test',
    });

    await sleep(2000);

    console.log('invoked', invoked);

    expect(invoked).toEqual(2);

    await worker.stop();

    await sleep(1000);
  }, 60000);
});
