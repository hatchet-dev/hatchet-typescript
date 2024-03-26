import HatchetError from '@util/errors/hatchet-error';
import * as z from 'zod';
import { HatchetTimeoutSchema } from './workflow';
import { Action } from './clients/dispatcher/action-listener';
import { LogLevel } from './clients/event/event-client';
import { Logger } from './util/logger';
import { parseJSON } from './util/parse';
import { AdminClient } from './clients/admin';
import { HatchetClient } from './clients/hatchet-client';

export const CreateStepSchema = z.object({
  name: z.string(),
  parents: z.array(z.string()).optional(),
  timeout: HatchetTimeoutSchema.optional(),
  retries: z.number().optional(),
});

type JSONPrimitive = string | number | boolean | null | Array<JSONPrimitive>;

export type NextStep = { [key: string]: NextStep | JSONPrimitive | Array<NextStep> };

interface ContextData<T, K> {
  input: T;
  parents: Record<string, any>;
  triggered_by: string;
  user_data: K;
}

interface ChildWorkflowRef<T> {
  workflowRunId: string;
  toPromise(): Promise<T>
  toJSON(): string;
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

  async spawnWorfklow<K=any>(workflowName: string, input: T, key?: string): Promise<string> {
    const { workflowRunId, stepRunId } = this.action;

    const childWorkflowRunIdPromise = this.client.admin.run_workflow(workflowName, input, {
      parentId: workflowRunId,
      parentStepRunId: stepRunId,
      childKey: key,
      childIndex: this.spawnIndex
    });

    this.spawnIndex++;

    const childWorkflowRunId = await childWorkflowRunIdPromise;

    return childWorkflowRunId;
  }

  // spawnScheduledWorfklow(workflowName: string, input: T, key?: string): void {
  //   this.client.admin.schedule_workflow(workflowName, input, user_data);
  // }

  // async join(refs: ChildWorkflowRef<K>[]): Promise<Array<K>> {
  //   this.client.admin.join(refs);
  // }


}

export type StepRunFunction<T, K> = (ctx: Context<T, K>) => Promise<NextStep> | NextStep | void;

export interface CreateStep<T, K> extends z.infer<typeof CreateStepSchema> {
  run: StepRunFunction<T, K>;
}
