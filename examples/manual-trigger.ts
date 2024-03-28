import Hatchet from '../src/sdk';

const hatchet = Hatchet.init();

async function main() {
  const workflowRunId = await hatchet.admin.run_workflow('simple-workflow', {});

  for await (const event of hatchet.listener.stream(workflowRunId)) {
    console.log('event received', event);
  }
}

main();
