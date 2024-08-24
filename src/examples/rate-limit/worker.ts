//Typescript
import { RateLimitDuration } from '../../protoc/workflows';
import Hatchet from '../../sdk';
import { Workflow } from '../../workflow';

const hatchet = Hatchet.init();
//START consuming-rate-limits
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
//END consuming-rate-limits

async function main() {
  //START declaring-global-limits
  await hatchet.admin.putRateLimit('test-limit', 1, RateLimitDuration.MINUTE);
  //END declaring-global-limits
  const worker = await hatchet.worker('example-worker');
  await worker.registerWorkflow(workflow);
  worker.start();
}

main();
