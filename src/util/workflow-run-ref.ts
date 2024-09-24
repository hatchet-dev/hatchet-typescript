/* eslint-disable max-classes-per-file */
import { ListenerClient, StepRunEvent } from '@hatchet/clients/listener/listener-client';
import { Status } from 'nice-grpc';
import { WorkflowRunEventType } from '../protoc/dispatcher';

type EventualWorkflowRunId =
  | string
  | Promise<string>
  | Promise<{
      workflowRunId: string;
    }>;

export class DedupeViolationErr extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DedupeViolationErr';
  }
}

async function getWorkflowRunId(workflowRunId: EventualWorkflowRunId): Promise<string> {
  if (typeof workflowRunId === 'string') {
    return workflowRunId;
  }

  if (workflowRunId instanceof Promise) {
    try {
      const resolved = await workflowRunId;
      if (typeof resolved === 'string') {
        return resolved;
      }

      return resolved.workflowRunId;
    } catch (e: any) {
      if (e.code && e.code === Status.ALREADY_EXISTS) {
        throw new DedupeViolationErr(e.details);
      }

      throw new Error('Invalid workflowRunId');
    }
  }

  throw new Error('Invalid workflowRunId');
}

export default class WorkflowRunRef<T> {
  workflowRunId: EventualWorkflowRunId;
  parentWorkflowRunId?: string;
  private client: ListenerClient;

  constructor(
    workflowRunId:
      | string
      | Promise<string>
      | Promise<{
          workflowRunId: string;
        }>,
    client: ListenerClient,
    parentWorkflowRunId?: string
  ) {
    this.workflowRunId = workflowRunId;
    this.parentWorkflowRunId = parentWorkflowRunId;
    this.client = client;
  }

  async getWorkflowRunId(): Promise<string> {
    return getWorkflowRunId(this.workflowRunId);
  }

  async stream(): Promise<AsyncGenerator<StepRunEvent, void, unknown>> {
    const workflowRunId = await getWorkflowRunId(this.workflowRunId);
    return this.client.stream(workflowRunId);
  }

  async result(): Promise<T> {
    const workflowRunId = await getWorkflowRunId(this.workflowRunId);

    const streamable = await this.client.get(workflowRunId);

    return new Promise<T>((resolve, reject) => {
      (async () => {
        for await (const event of streamable.stream()) {
          if (event.eventType === WorkflowRunEventType.WORKFLOW_RUN_EVENT_TYPE_FINISHED) {
            if (event.results.some((r) => !!r.error)) {
              reject(event.results);
              return;
            }

            if (event.results.length === 0) {
              const data = await this.client.api.workflowRunGet(
                this.client.config.tenant_id,
                event.workflowRunId
              );

              const res = data.data.jobRuns?.forEach((jr) => {
                // TODO map this data into the same format as the results
                console.log('jr', jr);
              });

              resolve({ big: 'data ' } as T);
              return;
            }

            const result = event.results.reduce(
              (acc, r) => ({
                ...acc,
                [r.stepReadableId]: JSON.parse(r.output || '{}'),
              }),
              {} as T
            );

            resolve(result);
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
