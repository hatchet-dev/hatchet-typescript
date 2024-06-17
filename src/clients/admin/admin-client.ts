import { Channel, ClientFactory } from 'nice-grpc';
import {
  CreateWorkflowVersionOpts,
  RateLimitDuration,
  WorkflowServiceClient,
  WorkflowServiceDefinition,
} from '@hatchet/protoc/workflows';
import HatchetError from '@util/errors/hatchet-error';
import { ClientConfig } from '@clients/hatchet-client/client-config';
import { Logger } from '@hatchet/util/logger';
import { retrier } from '@hatchet/util/retrier';

import { Api } from '../rest';
import { WorkflowRunStatus } from '../rest/generated/data-contracts';

type WorkflowMetricsQuery = {
  workflowId?: string;
  workflowName?: string;
  status?: WorkflowRunStatus;
  groupKey?: string;
};

/**
 * AdminClient is a client for interacting with the Hatchet Admin API. This allows you to configure, trigger,
 * and monitor workflows.
 * The admin client can be accessed via:
 * ```typescript
 * const hatchet = Hatchet.init()
 * const admin = hatchet.admin as AdminClient;
 *
 * // Now you can use the admin client to interact with the Hatchet Admin API
 * admin.list_workflows().then((res) => {
 *   res.rows?.forEach((row) => {
 *     console.log(row);
 *   });
 * });
 * ```
 */
export class AdminClient {
  config: ClientConfig;
  client: WorkflowServiceClient;
  api: Api;
  tenantId: string;
  logger: Logger;

  constructor(
    config: ClientConfig,
    channel: Channel,
    factory: ClientFactory,
    api: Api,
    tenantId: string
  ) {
    this.config = config;
    this.client = factory.create(WorkflowServiceDefinition, channel);
    this.api = api;
    this.tenantId = tenantId;
    this.logger = new Logger(`Admin`, config.log_level);
  }

  /**
   * Creates a new workflow or updates an existing workflow. If the workflow already exists, Hatchet will automatically
   * determine if the workflow definition has changed and create a new version if necessary.
   * @param workflow a workflow definition to create
   */
  async put_workflow(workflow: CreateWorkflowVersionOpts) {
    try {
      await retrier(async () => this.client.putWorkflow({ opts: workflow }), this.logger);
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  async put_rate_limit(
    key: string,
    limit: number,
    duration: RateLimitDuration = RateLimitDuration.SECOND
  ) {
    try {
      await retrier(
        async () =>
          this.client.putRateLimit({
            key,
            limit,
            duration,
          }),
        this.logger
      );
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  /**
   * Run a new instance of a workflow with the given input. This will create a new workflow run and return the ID of the
   * new run.
   * @param workflowName the name of the workflow to run
   * @param input an object containing the input to the workflow
   * @returns the ID of the new workflow run
   */
  async run_workflow<T = object>(
    workflowName: string,
    input: T,
    options?: {
      parentId?: string | undefined;
      parentStepRunId?: string | undefined;
      childIndex?: number | undefined;
      childKey?: string | undefined;
      additionalMetadata?: Record<string, string> | undefined;
    }
  ) {
    let computedName = workflowName;

    try {
      if (this.config.namespace && !workflowName.startsWith(this.config.namespace)) {
        computedName = this.config.namespace + workflowName;
      }

      const inputStr = JSON.stringify(input);

      const resp = await this.client.triggerWorkflow({
        name: computedName,
        input: inputStr,
        ...options,
        additionalMetadata: options?.additionalMetadata
          ? JSON.stringify(options?.additionalMetadata)
          : undefined,
      });

      return resp.workflowRunId;
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  /**
   * List workflows in the tenant associated with the API token.
   * @returns a list of all workflows in the tenant
   */
  async list_workflows() {
    const res = await this.api.workflowList(this.tenantId);
    return res.data;
  }

  /**
   * Get a workflow by its ID.
   * @param workflowId the workflow ID (**note:** this is not the same as the workflow version id)
   * @returns
   */
  async get_workflow(workflowId: string) {
    const res = await this.api.workflowGet(workflowId);
    return res.data;
  }

  /**
   * Get a workflow version.
   * @param workflowId the workflow ID
   * @param version the version of the workflow to get. If not provided, the latest version will be returned.
   * @returns the workflow version
   */
  async get_workflow_version(workflowId: string, version?: string) {
    const res = await this.api.workflowVersionGet(workflowId, {
      version,
    });

    return res.data;
  }

  /**
   * Get a workflow run.
   * @param workflowRunId the id of the workflow run to get
   * @returns the workflow run
   */
  async get_workflow_run(workflowRunId: string) {
    const res = await this.api.workflowRunGet(this.tenantId, workflowRunId);
    return res.data;
  }

  /**
   * List workflow runs in the tenant associated with the API token.
   * @param query the query to filter the list of workflow runs
   * @returns
   */
  async list_workflow_runs(query: {
    offset?: number | undefined;
    limit?: number | undefined;
    eventId?: string | undefined;
    workflowId?: string | undefined;
  }) {
    const res = await this.api.workflowRunList(this.tenantId, query);
    return res.data;
  }

  /**
   * Schedule a workflow to run at a specific time or times.
   * @param name the name of the workflow to schedule
   * @param options an object containing the schedules to set
   */
  schedule_workflow(name: string, options?: { schedules?: Date[] }) {
    try {
      this.client.scheduleWorkflow({
        name,
        schedules: options?.schedules,
      });
    } catch (e: any) {
      throw new HatchetError(e.message);
    }
  }

  /**
   * Get the metrics for a workflow.
   *
   * @param workflowId the ID of the workflow to get metrics for
   * @param workflowName the name of the workflow to get metrics for
   * @param query an object containing query parameters to filter the metrics
   */
  get_workflow_metrics({ workflowId, workflowName, status, groupKey }: WorkflowMetricsQuery) {
    const params = {
      status,
      groupKey,
    };

    if (workflowName) {
      this.list_workflows().then((res) => {
        const workflow = res.rows?.find((row) => row.name === workflowName);

        if (workflow) {
          return this.api.workflowGetMetrics(workflow.metadata.id, params);
        }

        throw new Error(`Workflow ${workflowName} not found`);
      });
    } else if (workflowId) {
      return this.api.workflowGetMetrics(workflowId, params);
    }

    throw new Error('Must provide either a workflowId or workflowName');
  }
}
