import { RateLimitDuration } from '../../protoc/workflows';
import Hatchet from '../../sdk';
import { Workflow } from '../../workflow';

const hatchet = Hatchet.init();

const workflow: Workflow = {
  id: 'rate-limit-workflow',
  description: 'test',
  on: {
    event: 'rate-limit:create',
  },
  steps: [
    {
      name: 'step1',
      rate_limits: [{ key: 'test-limit', units: 1 }],
      run: async (ctx) => {
        console.log('starting step1 with the following input', ctx.workflowInput());
        return { step1: 'step1 results!' };
      },
    },
  ],
};

async function main() {
  await hatchet.admin.putRateLimit('test-limit', 1, RateLimitDuration.MINUTE);
  const worker = await hatchet.worker('example-worker');
  await worker.registerWorkflow(workflow);
  worker.start();
}

main();
