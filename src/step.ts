/* eslint-disable max-classes-per-file */
import HatchetError from '@util/errors/hatchet-error';
import * as z from 'zod';
import { HatchetTimeoutSchema } from './workflow';
import { Action } from './clients/dispatcher/action-listener';
import { LogLevel } from './clients/event/event-client';
import { Logger } from './util/logger';
import { parseJSON } from './util/parse';
import { HatchetClient } from './clients/hatchet-client';
import { WorkflowRunEvent, WorkflowRunEventType } from './protoc/dispatcher';

export const CreateRateLimitSchema = z.object({
  key: z.string(),
  units: z.number().min(1),
});

export const CreateStepSchema = z.object({
  name: z.string(),
  parents: z.array(z.string()).optional(),
  timeout: HatchetTimeoutSchema.optional(),
  retries: z.number().optional(),
  rate_limits: z.array(CreateRateLimitSchema).optional(),
});

type JSONPrimitive = string | number | boolean | null | Array<JSONPrimitive>;

export type NextStep = { [key: string]: NextStep | JSONPrimitive | Array<NextStep> };

interface ContextData<T, K> {
  input: T;
  parents: Record<string, any>;
  triggered_by: string;
  user_data: K;
}

class ChildWorkflowRef<T> {
  workflowRunId: Promise<string>;
  client: HatchetClient;

  constructor(workflowRunId: Promise<string>, client: HatchetClient) {
    this.workflowRunId = workflowRunId;
    this.client = client;
  }

  async stream(): Promise<AsyncGenerator<WorkflowRunEvent, void, unknown>> {
    const workflowRunId = await this.workflowRunId;
    return this.client.listener.stream(workflowRunId);
  }

  async result(): Promise<T[]> {
    const workflowRunId = await this.workflowRunId;
    const listener = await this.client.listener.get(workflowRunId);

    return new Promise<T[]>((resolve, reject) => {
      (async () => {
        for await (const event of await listener.stream()) {
          if (event.eventType === WorkflowRunEventType.WORKFLOW_RUN_EVENT_TYPE_FINISHED) {
            if (event.results.some((r) => !!r.error)) {
              reject(event.results);
              return;
            }

            resolve(event.results as T[]);
            return;
          }
        }
      })();
    });
  }

  async toJSON(): Promise<string> {
    return JSON.stringify({
      workflowRunId: await this.workflowRunId,
    });
  }
}

export class Context<T, K> {
  data: ContextData<T, K>;
  input: T;
  controller = new AbortController();
  action: Action;
  client: HatchetClient;

  overridesData: Record<string, any> = {};
  logger: Logger;

  spawnIndex: number = 0;

  constructor(action: Action, client: HatchetClient) {
    try {
      const data = parseJSON(action.actionPayload);
      this.data = data;
      this.action = action;
      this.client = client;

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

  async putStream(data: string | Uint8Array) {
    const { stepRunId } = this.action;

    if (!stepRunId) {
      // log a warning
      this.logger.warn('cannot log from context without stepRunId');
      return;
    }

    await this.client.event.putStream(stepRunId, data);
  }

  spawnWorkflow<P = unknown>(workflowName: string, input: T, key?: string): ChildWorkflowRef<P> {
    const { workflowRunId, stepRunId } = this.action;

    const childWorkflowRunIdPromise = this.client.admin.run_workflow(workflowName, input, {
      parentId: workflowRunId,
      parentStepRunId: stepRunId,
      childKey: key,
      childIndex: this.spawnIndex,
    });

    this.spawnIndex += 1;

    return new ChildWorkflowRef(childWorkflowRunIdPromise, this.client);
  }
}

export type StepRunFunction<T, K> = (ctx: Context<T, K>) => Promise<NextStep> | NextStep | void;

export interface CreateStep<T, K> extends z.infer<typeof CreateStepSchema> {
  run: StepRunFunction<T, K>;
}
