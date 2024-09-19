/* eslint-disable max-classes-per-file */
import HatchetError from '@util/errors/hatchet-error';
import * as z from 'zod';
import { HatchetTimeoutSchema, Workflow } from './workflow';
import { Action } from './clients/dispatcher/action-listener';
import { LogLevel } from './clients/event/event-client';
import { Logger } from './util/logger';
import { parseJSON } from './util/parse';
import { HatchetClient } from './clients/hatchet-client';
import WorkflowRunRef from './util/workflow-run-ref';
import { Worker } from './clients/worker';
import { WorkerLabels } from './clients/dispatcher/dispatcher-client';
import { WorkerLabelComparator } from './protoc/workflows';

export const CreateRateLimitSchema = z.object({
  key: z.string(),
  units: z.number().min(1),
});

export const DesiredWorkerLabelSchema = z
  .union([
    z.string(),
    z.number().int(),
    z.object({
      value: z.union([z.string(), z.number()]),
      required: z.boolean().optional(),
      weight: z.number().int().optional(),

      // (optional) comparator for the label
      // if not provided, the default is EQUAL
      // desired COMPARATOR actual (i.e. desired > actual for GREATER_THAN)
      comparator: z.nativeEnum(WorkerLabelComparator).optional(),
    }),
  ])
  .optional();

export const CreateStepSchema = z.object({
  name: z.string(),
  parents: z.array(z.string()).optional(),
  timeout: HatchetTimeoutSchema.optional(),
  retries: z.number().optional(),
  rate_limits: z.array(CreateRateLimitSchema).optional(),
  worker_labels: z.record(z.lazy(() => DesiredWorkerLabelSchema)).optional(),
});

export type JsonObject = { [Key in string]: JsonValue } & {
  [Key in string]?: JsonValue | undefined;
};

export type JsonArray = JsonValue[] | readonly JsonValue[];

export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export type NextStep = { [key: string]: JsonValue };

interface ContextData<T, K> {
  input: T;
  parents: Record<string, any>;
  triggered_by: string;
  user_data: K;
}

export class ContextWorker {
  private worker: Worker;
  constructor(worker: Worker) {
    this.worker = worker;
  }

  id() {
    return this.worker.workerId;
  }

  hasWorkflow(workflowName: string) {
    return !!this.worker.workflow_registry.find((workflow) => workflow.id === workflowName);
  }

  labels() {
    return this.worker.labels;
  }

  upsertLabels(labels: WorkerLabels) {
    return this.worker.upsertLabels(labels);
  }
}

export class Context<T, K = {}> {
  data: ContextData<T, K>;
  input: T;
  controller = new AbortController();
  action: Action;
  client: HatchetClient;

  worker: ContextWorker;

  overridesData: Record<string, any> = {};
  logger: Logger;

  spawnIndex: number = 0;

  constructor(action: Action, client: HatchetClient, worker: Worker) {
    try {
      const data = parseJSON(action.actionPayload);
      this.data = data;
      this.action = action;
      this.client = client;
      this.worker = new ContextWorker(worker);
      this.logger = new Logger(`Context Logger`, client.config.log_level);

      // if this is a getGroupKeyRunId, the data is the workflow input
      if (action.getGroupKeyRunId !== '') {
        this.input = data;
      } else {
        this.input = data.input;
      }

      this.overridesData = data.overrides || {};
    } catch (e: any) {
      throw new HatchetError(`Could not parse payload: ${e.message}`);
    }
  }

  stepOutput(step: string): NextStep {
    if (!this.data.parents) {
      throw new HatchetError('Step output not found');
    }
    if (!this.data.parents[step]) {
      throw new HatchetError(`Step output for '${step}' not found`);
    }
    return this.data.parents[step];
  }

  triggeredByEvent(): boolean {
    return this.data?.triggered_by === 'event';
  }

  workflowInput(): T {
    return this.input;
  }

  workflowName(): string {
    return this.action.jobName;
  }

  userData(): K {
    return this.data?.user_data;
  }

  stepName(): string {
    return this.action.stepName;
  }

  workflowRunId(): string {
    return this.action.workflowRunId;
  }

  retryCount(): number {
    return this.action.retryCount;
  }

  playground(name: string, defaultValue: string = ''): string {
    if (name in this.overridesData) {
      return this.overridesData[name];
    }

    this.client.dispatcher.putOverridesData({
      stepRunId: this.action.stepRunId,
      path: name,
      value: JSON.stringify(defaultValue),
    });

    return defaultValue;
  }

  log(message: string, level?: LogLevel): void {
    const { stepRunId } = this.action;

    if (!stepRunId) {
      // log a warning
      this.logger.warn('cannot log from context without stepRunId');
      return;
    }

    this.client.event.putLog(stepRunId, message, level);
  }

  /**
   * Refreshes the timeout for the current step.
   * @param incrementBy - The interval by which to increment the timeout.
   *                     The interval should be specified in the format of '10s' for 10 seconds,
   *                     '1m' for 1 minute, or '1d' for 1 day.
   */
  async refreshTimeout(incrementBy: string) {
    const { stepRunId } = this.action;

    if (!stepRunId) {
      // log a warning
      this.logger.warn('cannot refresh timeout from context without stepRunId');
      return;
    }

    await this.client.dispatcher.refreshTimeout(incrementBy, stepRunId);
  }

  async releaseSlot(): Promise<void> {
    await this.client.dispatcher.client.releaseSlot({
      stepRunId: this.action.stepRunId,
    });
  }

  async putStream(data: string | Uint8Array) {
    const { stepRunId } = this.action;

    if (!stepRunId) {
      // log a warning
      this.logger.warn('cannot log from context without stepRunId');
      return;
    }

    await this.client.event.putStream(stepRunId, data);
  }

  /**
   * Spawns a new workflow.
   *
   * @param workflowName the name of the workflow to spawn
   * @param input the input data for the workflow
   * @param options additional options for spawning the workflow. If a string is provided, it is used as the key.
   *                If an object is provided, it can include:
   *                - key: a unique identifier for the workflow (deprecated, use options.key instead)
   *                - sticky: a boolean indicating whether to use sticky execution
   * @param <Q> the type of the input data
   * @param <P> the type of the output data
   * @return a reference to the spawned workflow run
   */
  spawnWorkflow<Q = JsonValue, P = JsonValue>(
    workflow: string | Workflow,
    input: Q,
    options?:
      | string
      | { key?: string; sticky?: boolean; additionalMetadata?: Record<string, string> }
  ): WorkflowRunRef<P> {
    const { workflowRunId, stepRunId } = this.action;

    let workflowName: string = '';

    if (typeof workflow === 'string') {
      workflowName = workflow;
    } else {
      workflowName = workflow.id;
    }

    const name = this.client.config.namespace + workflowName;

    let key: string | undefined = '';
    let sticky: boolean | undefined = false;
    let metadata: Record<string, string> | undefined;

    if (typeof options === 'string') {
      this.logger.warn(
        'Using key param is deprecated and will be removed in a future release. Use options.key instead.'
      );
      key = options;
    } else {
      key = options?.key;
      sticky = options?.sticky;
      metadata = options?.additionalMetadata;
    }

    if (sticky && !this.worker.hasWorkflow(name)) {
      throw new HatchetError(
        `cannot run with sticky: workflow ${name} is not registered on the worker`
      );
    }

    try {
      const resp = this.client.admin.runWorkflow<Q, P>(name, input, {
        parentId: workflowRunId,
        parentStepRunId: stepRunId,
        childKey: key,
        childIndex: this.spawnIndex,
        desiredWorkerId: sticky ? this.worker.id() : undefined,
        additionalMetadata: metadata,
      });

      this.spawnIndex += 1;

      return resp;
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  additionalMetadata(): Record<string, string> {
    if (!this.action.additionalMetadata) {
      return {};
    }

    // parse the additional metadata
    const res: Record<string, string> = parseJSON(this.action.additionalMetadata);
    return res;
  }

  childIndex(): number | undefined {
    return this.action.childWorkflowIndex;
  }

  childKey(): string | undefined {
    return this.action.childWorkflowKey;
  }

  parentWorkflowRunId(): string | undefined {
    return this.action.parentWorkflowRunId;
  }
}

export type StepRunFunction<T, K> = (
  ctx: Context<T, K>
) => Promise<NextStep | void> | NextStep | void;

export interface CreateStep<T, K> extends z.infer<typeof CreateStepSchema> {
  run: StepRunFunction<T, K>;
}
