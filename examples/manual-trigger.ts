import Hatchet from '../src/sdk';

const hatchet = Hatchet.init();

async function main() {
  const workflowRunId = await hatchet.admin.run_workflow('example', {});

  for await (const event of hatchet.listener.stream(workflowRunId)) {
    console.log('event received', event);
  }
}

main();
