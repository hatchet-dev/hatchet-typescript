import { Worker } from '..';
import sleep from '../util/sleep';
import Hatchet from '../sdk';
import { priorityWorkflow1, priorityWorkflow2, TimedResponse } from './priority-worker';

describe('e2e', () => {
  let hatchet: Hatchet;
  let worker: Worker;

  beforeEach(async () => {
    hatchet = Hatchet.init({
      namespace: `test${Math.random().toString(36).substring(7)}`,
    });
    worker = await hatchet.worker('example-worker', {
      maxRuns: 1,
    });
  });

  afterEach(async () => {
    await worker.stop();
    await sleep(2000);
  });

  it('should be executed in the right order', async () => {
    await worker.registerWorkflow(priorityWorkflow1);
    await worker.registerWorkflow(priorityWorkflow2);
    void worker.start();
    await sleep(5000);
    console.log('worker started.');

    console.log('running runs...');

    const run0 = await hatchet.admin.runWorkflow<any, { step1: TimedResponse }>(
      'priority-2-workflow',
      {}
    );
    const run1 = await hatchet.admin.runWorkflow<any, { step1: TimedResponse }>(
      'priority-2-workflow',
      {}
    );
    const run2 = await hatchet.admin.runWorkflow<any, { step1: TimedResponse }>(
      'priority-1-workflow',
      {}
    );
    const run3 = await hatchet.admin.runWorkflow<any, { step1: TimedResponse }>(
      'priority-2-workflow',
      {}
    );

    const results = await Promise.all([run0.result(), run1.result(), run2.result(), run3.result()]);

    console.log('results', results);

    // Verify that run4 is the last run
    const lastRunTime = Math.max(...results.map((r) => r.step1.time));
    expect(results[3].step1.time).toBe(lastRunTime);

    await worker.stop();
  }, 60000);
});
