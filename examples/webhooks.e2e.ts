import { createServer } from 'node:http';
import { Workflow, Worker } from '../src';
import sleep from '../src/util/sleep';
import Hatchet from '../src/sdk';

const port = 8369;

describe('webhooks', () => {
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

  it('should pass a webhook workflow', async () => {
    let invoked = 0;

    const workflow: Workflow = {
      id: 'simple-webhook-workflow',
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

    console.log('registering webhook...');
    await worker.registerWebhook({
      secret,
      url: `http://localhost:${port}/webhook`,
      workflows: ['simple-webhook-workflow'],
    });

    console.log('starting worker...');

    const handler = hatchet.webhooks(workflow);

    const server = createServer(handler.httpHandler({ secret }));

    await new Promise((resolve) => {
      server.listen(port, () => {
        resolve('');
      });
    });

    console.log('server started.');
    console.log('waiting for webhook to be registered...');

    // wait for engine to pick up the webhook worker
    await sleep(30000 + 3000);

    console.log('webhook wait time complete.');

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
