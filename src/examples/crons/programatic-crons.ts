import Hatchet from '../../sdk';
import { simpleCronWorkflow } from './cron-worker';

const hatchet = Hatchet.init();

// This example assumes you have a worker already running
// and registered the cron workflow to it

async function main() {
  // ? Create
  // You can create dynamic cron triggers programmatically via the API

  const createdCron = await hatchet.cron.create(
    simpleCronWorkflow, // workflow object or string workflow id
    {
      name: 'customer-a-daily-report', // friendly name for the cron trigger
      expression: '0 12 * * *', // every day at noon
    }
  );

  const { id } = createdCron.metadata; // id which you can later use to reference the cron trigger
  // !!

  // ? List
  // You can list all cron triggers by passing in a query object
  const cronList = await hatchet.cron.list({
    offset: 0,
    limit: 10,
  });
  // !!

  // ? Get
  // You can get a specific cron trigger by passing in the cron trigger id
  const cron = await hatchet.cron.get(id);
  // !!

  // ? Delete
  // You can delete a cron trigger by passing the cron object
  // or a cron Id to the delete method
  await hatchet.cron.delete(cron);
  // !!
}

main();
