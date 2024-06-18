import https from 'https';
import Hatchet, { Context, AdminClient } from '../src';
import { CreateWorkflowVersionOpts } from '../src/protoc/workflows';

type CustomUserData = {
  example: string;
};

const opts: CreateWorkflowVersionOpts = {
  name: 'api-workflow',
  description: 'My workflow',
  version: '',
  eventTriggers: [],
  cronTriggers: [],
  scheduledTriggers: [],
  concurrency: undefined,
  jobs: [
    {
      name: 'my-job',
      description: 'Job description',
      steps: [
        {
          retries: 0,
          readableId: 'custom-step',
          action: `slack:example`,
          timeout: '60s',
          inputs: '{}',
          parents: [],
          userData: `{
            "example": "value"
          }`,
          rateLimits: [],
        },
      ],
    },
  ],
};

type StepOneInput = {
  key: string;
};

async function main() {
  const hatchet = Hatchet.init();

  const admin = hatchet.admin as AdminClient;

  admin.put_workflow(opts).then((res) => {
    console.log(res);
  });

  admin.list_workflows().then((res) => {
    res.rows?.forEach((row) => {
      console.log(row);
    });
  });

  const worker = await hatchet.worker('example-worker');

  worker.registerAction('slack:example', async (ctx: Context<StepOneInput, CustomUserData>) => {
    const setData = ctx.userData();
    console.log('executed step1!', setData);
    return { step1: 'step1' };
  });

  hatchet.admin.run_workflow('api-workflow', {});

  worker.start();
}

main();
