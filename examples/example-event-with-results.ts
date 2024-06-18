import Hatchet from '../src/sdk';

async function main() {
  const hatchet = Hatchet.init();

  const workflowRunId = await hatchet.admin.runWorkflow('simple-workflow', {
    test: 'test',
  });

  const listener = hatchet.listener.stream(workflowRunId);

  console.log('listening for events');
  for await (const event of listener) {
    console.log('event received', event);
  }
  console.log('done listening for events');
}

main();
