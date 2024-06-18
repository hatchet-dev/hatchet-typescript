import Hatchet from '../src/sdk';

const hatchet = Hatchet.init();

async function main() {
  const workflowRunId = await hatchet.admin.runWorkflow('simple-workflow', {});
  const stream = await hatchet.listener.stream(workflowRunId);

  for await (const event of stream) {
    console.log('event received', event);
  }
}

main();
