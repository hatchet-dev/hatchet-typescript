import { WorkflowRun } from '@hatchet/clients/admin';
import Hatchet from '../sdk';

const hatchet = Hatchet.init();

async function main() {
  const workflowRuns: WorkflowRun[] = [];

  const workflowRunResponse = hatchet.admin.runWorkflow(
    'sticky-workflow',
    {},
    {
      additionalMetadata: {
        key: 'value',
      },
    }
  );

  const result = await workflowRunResponse;

  for await (const event of await result.stream()) {
    console.log('event received', event);
  }
}

main();
