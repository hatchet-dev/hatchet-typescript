import { createServer } from 'node:http';
import { Workflow, Worker } from '../src';
import sleep from '../src/util/sleep';
import Hatchet from '../src/sdk';

const port = 8369;

describe('e2e', () => {
  let hatchet: Hatchet;
  let worker: Worker;

  beforeEach(async () => {
    hatchet = Hatchet.init();
    worker = await hatchet.worker('simple-webhook-workflow');
  });

  afterEach(async () => {
    await worker.stop();
    await sleep(2000);
  });

  it('should pass a simple workflow', async () => {
    let invoked = 0;

    const workflow: Workflow = {
      id: 'simple-webhook-workflow',
      webhook: `http://localhost:${port}/webhook`,
      description: 'test',
      on: {
        event: 'user:create-webhook',
      },
      steps: [
        {
          name: 'step1',
          run: async (ctx) => {
            invoked += 1;
            return { message: `${ctx.workflowName()} results!` };
          },
        },
        {
          name: 'step2',
          parents: ['step1'],
          run: (ctx) => {
            invoked += 1;
            return { message: `${ctx.workflowName()} results!` };
          },
        },
      ],
    };

    console.log('registering workflow...');
    await worker.registerWorkflow(workflow);

    const secret = 'secret';
    const server = createServer(await worker.httpHandler(secret));

    await new Promise((resolve) => {
      server.listen(port, () => {
        resolve('');
      });
    });

    console.log('worker started.');

    await sleep(5000);

    console.log('pushing event...');

    await hatchet.event.push('user:create-webhook', {
      test: 'test',
    });

    await sleep(10000);

    console.log('invoked', invoked);

    expect(invoked).toEqual(2);

    await worker.stop();
  }, 60000);
});
