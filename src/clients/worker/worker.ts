import { HatchetClient } from '@clients/hatchet-client';
import HatchetError from '@util/errors/hatchet-error';
import { Action, ActionListener } from '@clients/dispatcher/action-listener';
import {
  StepActionEvent,
  StepActionEventType,
  ActionType,
  GroupKeyActionEvent,
  GroupKeyActionEventType,
  actionTypeFromJSON,
} from '@hatchet/protoc/dispatcher';
import HatchetPromise from '@util/hatchet-promise/hatchet-promise';
import { Workflow } from '@hatchet/workflow';
import {
  ConcurrencyLimitStrategy,
  CreateWorkflowJobOpts,
  CreateWorkflowStepOpts,
  WorkflowConcurrencyOpts,
} from '@hatchet/protoc/workflows';
import { Logger } from '@hatchet/util/logger';
import { WebhookHandler } from '@clients/worker/handler';
import { WebhookWorkerCreateRequest } from '@clients/rest/generated/data-contracts';
import { Context, StepRunFunction } from '../../step';

export type ActionRegistry = Record<Action['actionId'], Function>;

export class Worker {
  client: HatchetClient;
  name: string;
  killing: boolean;
  handle_kill: boolean;

  action_registry: ActionRegistry;
  listener: ActionListener | undefined;
  futures: Record<Action['stepRunId'], HatchetPromise<any>> = {};
  contexts: Record<Action['stepRunId'], Context<any, any>> = {};
  maxRuns?: number;

  logger: Logger;

  registeredWorkflowPromises: Array<Promise<any>> = [];
  registeredWorkflowIds: string[] = [];

  constructor(
    client: HatchetClient,
    options: { name: string; handleKill?: boolean; maxRuns?: number }
  ) {
    this.client = client;
    this.name = this.client.config.namespace + options.name;
    this.action_registry = {};
    this.maxRuns = options.maxRuns;

    process.on('SIGTERM', () => this.exitGracefully(true));
    process.on('SIGINT', () => this.exitGracefully(true));

    this.killing = false;
    this.handle_kill = options.handleKill === undefined ? true : options.handleKill;

    this.logger = new Logger(`Worker/${this.name}`, this.client.config.log_level);
  }

  private registerActions(workflow: Workflow) {
    const newActions = workflow.steps.reduce<ActionRegistry>((acc, step) => {
      acc[`${workflow.id}:${step.name}`] = step.run;
      return acc;
    }, {});

    const onFailureAction = workflow.onFailure
      ? {
          [`${workflow.id}-on-failure:${workflow.onFailure.name}`]: workflow.onFailure.run,
        }
      : {};

    this.action_registry = {
      ...this.action_registry,
      ...newActions,
      ...onFailureAction,
    };

    this.action_registry = workflow.concurrency?.name
      ? {
          ...this.action_registry,
          [`${workflow.id}:${workflow.concurrency.name}`]: workflow.concurrency.key,
        }
      : {
          ...this.action_registry,
        };
  }

  getHandler(workflow: Workflow) {
    const wf: Workflow = {
      ...workflow,
      id: this.client.config.namespace + workflow.id,
    };

    this.registerActions(wf);

    return new WebhookHandler(this);
  }

  async registerWebhook(webhook: WebhookWorkerCreateRequest) {
    return this.client.admin.webhook_create({ ...webhook, workflows: this.registeredWorkflowIds });
  }

  // @deprecated
  async registerWorkflow(initWorkflow: Workflow) {
    return this.register_workflow(initWorkflow);
  }

  async register_workflow(initWorkflow: Workflow) {
    const workflow: Workflow = {
      ...initWorkflow,
      id: this.client.config.namespace + initWorkflow.id,
    };
    try {
      const concurrency: WorkflowConcurrencyOpts | undefined = workflow.concurrency?.name
        ? {
            action: `${workflow.id}:${workflow.concurrency.name}`,
            maxRuns: workflow.concurrency.maxRuns || 1,
            limitStrategy:
              workflow.concurrency.limitStrategy || ConcurrencyLimitStrategy.CANCEL_IN_PROGRESS,
          }
        : undefined;

      const onFailureJob: CreateWorkflowJobOpts | undefined = workflow.onFailure
        ? {
            name: `${workflow.id}-on-failure`,
            description: workflow.description,
            steps: [
              {
                readableId: workflow.onFailure.name,
                action: `${workflow.id}-on-failure:${workflow.onFailure.name}`,
                timeout: workflow.onFailure.timeout || '60s',
                inputs: '{}',
                parents: [],
                userData: '{}',
                retries: workflow.onFailure.retries || 0,
                rateLimits: workflow.onFailure.rate_limits ?? [],
              },
            ],
          }
        : undefined;

      this.registeredWorkflowIds.push(workflow.id);

      const registeredWorkflow = this.client.admin.put_workflow({
        name: workflow.id,
        description: workflow.description,
        version: workflow.version || '',
        eventTriggers: workflow.on.event ? [this.client.config.namespace + workflow.on.event] : [],
        cronTriggers: workflow.on.cron ? [workflow.on.cron] : [],
        scheduledTriggers: [],
        concurrency,
        scheduleTimeout: workflow.scheduleTimeout,
        onFailureJob,
        jobs: [
          {
            name: workflow.id,
            description: workflow.description,
            steps: workflow.steps.map<CreateWorkflowStepOpts>((step) => ({
              readableId: step.name,
              action: `${workflow.id}:${step.name}`,
              timeout: step.timeout || '60s',
              inputs: '{}',
              parents: step.parents ?? [],
              userData: '{}',
              retries: step.retries || 0,
              rateLimits: step.rate_limits ?? [], // Add the missing rateLimits property
            })),
          },
        ],
      });
      this.registeredWorkflowPromises.push(registeredWorkflow);
      await registeredWorkflow;
    } catch (e: any) {
      throw new HatchetError(`Could not register workflow: ${e.message}`);
    }

    this.registerActions(workflow);
  }

  registerAction<T, K>(actionId: string, action: StepRunFunction<T, K>) {
    this.action_registry[actionId] = action;
  }

  async handleStartStepRun(action: Action) {
    const { actionId } = action;

    try {
      const context = new Context(action, this.client);
      this.contexts[action.stepRunId] = context;

      const step = this.action_registry[actionId];

      if (!step) {
        this.logger.error(`Could not find step '${actionId}'`);
        return;
      }

      const run = async () => {
        return step(context);
      };

      const success = (result: any) => {
        this.logger.info(`Step run ${action.stepRunId} succeeded`);

        try {
          // Send the action event to the dispatcher
          const event = this.getStepActionEvent(
            action,
            StepActionEventType.STEP_EVENT_TYPE_COMPLETED,
            result || null
          );
          this.client.dispatcher.sendStepActionEvent(event).catch((e) => {
            this.logger.error(`Could not send completed action event: ${e.message}`);

            // send a failure event
            const failureEvent = this.getStepActionEvent(
              action,
              StepActionEventType.STEP_EVENT_TYPE_FAILED,
              e.message
            );

            this.client.dispatcher.sendStepActionEvent(failureEvent).catch((err2) => {
              this.logger.error(`Could not send failed action event: ${err2.message}`);
            });
          });

          // delete the run from the futures
          delete this.futures[action.stepRunId];
        } catch (e: any) {
          this.logger.error(`Could not send action event: ${e.message}`);
        }
      };

      const failure = (error: any) => {
        this.logger.error(`Step run ${action.stepRunId} failed: ${error.message}`);

        if (error.stack) {
          this.logger.error(error.stack);
        }

        try {
          // Send the action event to the dispatcher
          const event = this.getStepActionEvent(
            action,
            StepActionEventType.STEP_EVENT_TYPE_FAILED,
            {
              message: error?.message,
              stack: error?.stack,
            }
          );
          this.client.dispatcher.sendStepActionEvent(event).catch((e) => {
            this.logger.error(`Could not send action event: ${e.message}`);
          });
          // delete the run from the futures
          delete this.futures[action.stepRunId];
        } catch (e: any) {
          this.logger.error(`Could not send action event: ${e.message}`);
        }
      };

      const future = new HatchetPromise(run().then(success).catch(failure));
      this.futures[action.stepRunId] = future;

      // Send the action event to the dispatcher
      const event = this.getStepActionEvent(action, StepActionEventType.STEP_EVENT_TYPE_STARTED);
      this.client.dispatcher.sendStepActionEvent(event).catch((e) => {
        this.logger.error(`Could not send action event: ${e.message}`);
      });

      await future.promise;
    } catch (e: any) {
      this.logger.error(`Could not send action event: ${e.message}`);
    }
  }

  async handleStartGroupKeyRun(action: Action) {
    const { actionId } = action;

    try {
      const context = new Context(action, this.client);

      const key = action.getGroupKeyRunId;

      if (!key) {
        this.logger.error(`No group key run id provided for action ${actionId}`);
        return;
      }

      this.contexts[key] = context;

      this.logger.debug(`Starting group key run ${key}`);

      const step = this.action_registry[actionId];

      if (!step) {
        this.logger.error(`Could not find step '${actionId}'`);
        return;
      }

      const run = async () => {
        return step(context);
      };

      const success = (result: any) => {
        this.logger.info(`Step run ${action.stepRunId} succeeded`);

        try {
          // Send the action event to the dispatcher
          const event = this.getGroupKeyActionEvent(
            action,
            GroupKeyActionEventType.GROUP_KEY_EVENT_TYPE_COMPLETED,
            result
          );
          this.client.dispatcher.sendGroupKeyActionEvent(event).catch((e) => {
            this.logger.error(`Could not send action event: ${e.message}`);
          });

          // delete the run from the futures
          delete this.futures[key];
        } catch (e: any) {
          this.logger.error(`Could not send action event: ${e.message}`);
        }
      };

      const failure = (error: any) => {
        this.logger.error(`Step run ${key} failed: ${error.message}`);

        try {
          // Send the action event to the dispatcher
          const event = this.getGroupKeyActionEvent(
            action,
            GroupKeyActionEventType.GROUP_KEY_EVENT_TYPE_FAILED,
            error
          );
          this.client.dispatcher.sendGroupKeyActionEvent(event).catch((e) => {
            this.logger.error(`Could not send action event: ${e.message}`);
          });
          // delete the run from the futures
          delete this.futures[key];
        } catch (e: any) {
          this.logger.error(`Could not send action event: ${e.message}`);
        }
      };

      const future = new HatchetPromise(run().then(success).catch(failure));
      this.futures[key] = future;

      // Send the action event to the dispatcher
      const event = this.getGroupKeyActionEvent(
        action,
        GroupKeyActionEventType.GROUP_KEY_EVENT_TYPE_STARTED
      );
      this.client.dispatcher.sendGroupKeyActionEvent(event).catch((e) => {
        this.logger.error(`Could not send action event: ${e.message}`);
      });

      await future.promise;
    } catch (e: any) {
      this.logger.error(`Could not send action event: ${e.message}`);
    }
  }

  getStepActionEvent(
    action: Action,
    eventType: StepActionEventType,
    payload: any = ''
  ): StepActionEvent {
    return {
      workerId: this.name,
      jobId: action.jobId,
      jobRunId: action.jobRunId,
      stepId: action.stepId,
      stepRunId: action.stepRunId,
      actionId: action.actionId,
      eventTimestamp: new Date(),
      eventType,
      eventPayload: JSON.stringify(payload),
    };
  }

  getGroupKeyActionEvent(
    action: Action,
    eventType: GroupKeyActionEventType,
    payload: any = ''
  ): GroupKeyActionEvent {
    if (!action.getGroupKeyRunId) {
      throw new HatchetError('No group key run id provided');
    }
    return {
      workerId: this.name,
      workflowRunId: action.workflowRunId,
      getGroupKeyRunId: action.getGroupKeyRunId,
      actionId: action.actionId,
      eventTimestamp: new Date(),
      eventType,
      eventPayload: JSON.stringify(payload),
    };
  }

  async handleCancelStepRun(action: Action) {
    try {
      this.logger.info(`Cancelling step run ${action.stepRunId}`);

      const { stepRunId } = action;
      const future = this.futures[stepRunId];
      const context = this.contexts[stepRunId];

      if (context && context.controller) {
        context.controller.abort('Cancelled by worker');
        delete this.contexts[stepRunId];
      }

      if (future) {
        future.promise.catch(() => {
          this.logger.info(`Cancelled step run ${action.stepRunId}`);
        });
        future.cancel('Cancelled by worker');
        await future.promise;
        delete this.futures[stepRunId];
      }
    } catch (e: any) {
      this.logger.error(`Could not cancel step run: ${e.message}`);
    }
  }

  async stop() {
    await this.exitGracefully(false);
  }

  async exitGracefully(handleKill: boolean) {
    this.killing = true;

    this.logger.info('Starting to exit...');

    try {
      await this.listener?.unregister();
    } catch (e: any) {
      this.logger.error(`Could not unregister listener: ${e.message}`);
    }

    this.logger.info('Gracefully exiting hatchet worker, running tasks will attempt to finish...');

    // attempt to wait for futures to finish
    await Promise.all(Object.values(this.futures).map(({ promise }) => promise));

    this.logger.info('Successfully finished pending tasks.');

    if (handleKill) {
      this.logger.info('Exiting hatchet worker...');
      process.exit(0);
    }
  }

  async start() {
    // ensure all workflows are registered
    await Promise.all(this.registeredWorkflowPromises);

    try {
      this.listener = await this.client.dispatcher.getActionListener({
        workerName: this.name,
        services: ['default'],
        actions: Object.keys(this.action_registry),
        maxRuns: this.maxRuns,
      });

      const generator = this.listener.actions();

      this.logger.info(`Worker ${this.name} listening for actions`);

      for await (const action of generator) {
        this.logger.info(
          `Worker ${this.name} received action ${action.actionId}:${action.actionType}`
        );

        void this.handleAction(action);
      }
    } catch (e: any) {
      // TODO TEMP this needs to be handled better
      if (this.killing) {
        this.logger.info(`Exiting worker, ignoring error: ${e.message}`);
        return;
      }
      this.logger.error(`Could not run worker: ${e.message}`);
      throw new HatchetError(`Could not run worker: ${e.message}`);
    }
  }

  async handleAction(action: Action) {
    const type = action.actionType
      ? actionTypeFromJSON(action.actionType)
      : ActionType.START_STEP_RUN;
    if (type === ActionType.START_STEP_RUN) {
      await this.handleStartStepRun(action);
    } else if (type === ActionType.CANCEL_STEP_RUN) {
      await this.handleCancelStepRun(action);
    } else if (type === ActionType.START_GET_GROUP_KEY) {
      await this.handleStartGroupKeyRun(action);
    } else {
      this.logger.error(`Worker ${this.name} received unknown action type ${type}`);
    }
  }
}
