/* eslint-disable */
import type { CallContext, CallOptions } from 'nice-grpc-common';
import * as _m0 from 'protobufjs/minimal';
import { Timestamp } from '../google/protobuf/timestamp';

export const protobufPackage = '';

export enum StickyStrategy {
  SOFT = 0,
  HARD = 1,
  UNRECOGNIZED = -1,
}

export function stickyStrategyFromJSON(object: any): StickyStrategy {
  switch (object) {
    case 0:
    case 'SOFT':
      return StickyStrategy.SOFT;
    case 1:
    case 'HARD':
      return StickyStrategy.HARD;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return StickyStrategy.UNRECOGNIZED;
  }
}

export function stickyStrategyToJSON(object: StickyStrategy): string {
  switch (object) {
    case StickyStrategy.SOFT:
      return 'SOFT';
    case StickyStrategy.HARD:
      return 'HARD';
    case StickyStrategy.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export enum WorkflowKind {
  FUNCTION = 0,
  DURABLE = 1,
  DAG = 2,
  UNRECOGNIZED = -1,
}

export function workflowKindFromJSON(object: any): WorkflowKind {
  switch (object) {
    case 0:
    case 'FUNCTION':
      return WorkflowKind.FUNCTION;
    case 1:
    case 'DURABLE':
      return WorkflowKind.DURABLE;
    case 2:
    case 'DAG':
      return WorkflowKind.DAG;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return WorkflowKind.UNRECOGNIZED;
  }
}

export function workflowKindToJSON(object: WorkflowKind): string {
  switch (object) {
    case WorkflowKind.FUNCTION:
      return 'FUNCTION';
    case WorkflowKind.DURABLE:
      return 'DURABLE';
    case WorkflowKind.DAG:
      return 'DAG';
    case WorkflowKind.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export enum ConcurrencyLimitStrategy {
  CANCEL_IN_PROGRESS = 0,
  DROP_NEWEST = 1,
  QUEUE_NEWEST = 2,
  GROUP_ROUND_ROBIN = 3,
  UNRECOGNIZED = -1,
}

export function concurrencyLimitStrategyFromJSON(object: any): ConcurrencyLimitStrategy {
  switch (object) {
    case 0:
    case 'CANCEL_IN_PROGRESS':
      return ConcurrencyLimitStrategy.CANCEL_IN_PROGRESS;
    case 1:
    case 'DROP_NEWEST':
      return ConcurrencyLimitStrategy.DROP_NEWEST;
    case 2:
    case 'QUEUE_NEWEST':
      return ConcurrencyLimitStrategy.QUEUE_NEWEST;
    case 3:
    case 'GROUP_ROUND_ROBIN':
      return ConcurrencyLimitStrategy.GROUP_ROUND_ROBIN;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return ConcurrencyLimitStrategy.UNRECOGNIZED;
  }
}

export function concurrencyLimitStrategyToJSON(object: ConcurrencyLimitStrategy): string {
  switch (object) {
    case ConcurrencyLimitStrategy.CANCEL_IN_PROGRESS:
      return 'CANCEL_IN_PROGRESS';
    case ConcurrencyLimitStrategy.DROP_NEWEST:
      return 'DROP_NEWEST';
    case ConcurrencyLimitStrategy.QUEUE_NEWEST:
      return 'QUEUE_NEWEST';
    case ConcurrencyLimitStrategy.GROUP_ROUND_ROBIN:
      return 'GROUP_ROUND_ROBIN';
    case ConcurrencyLimitStrategy.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export enum WorkerLabelComparator {
  EQUAL = 0,
  NOT_EQUAL = 1,
  GREATER_THAN = 2,
  GREATER_THAN_OR_EQUAL = 3,
  LESS_THAN = 4,
  LESS_THAN_OR_EQUAL = 5,
  UNRECOGNIZED = -1,
}

export function workerLabelComparatorFromJSON(object: any): WorkerLabelComparator {
  switch (object) {
    case 0:
    case 'EQUAL':
      return WorkerLabelComparator.EQUAL;
    case 1:
    case 'NOT_EQUAL':
      return WorkerLabelComparator.NOT_EQUAL;
    case 2:
    case 'GREATER_THAN':
      return WorkerLabelComparator.GREATER_THAN;
    case 3:
    case 'GREATER_THAN_OR_EQUAL':
      return WorkerLabelComparator.GREATER_THAN_OR_EQUAL;
    case 4:
    case 'LESS_THAN':
      return WorkerLabelComparator.LESS_THAN;
    case 5:
    case 'LESS_THAN_OR_EQUAL':
      return WorkerLabelComparator.LESS_THAN_OR_EQUAL;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return WorkerLabelComparator.UNRECOGNIZED;
  }
}

export function workerLabelComparatorToJSON(object: WorkerLabelComparator): string {
  switch (object) {
    case WorkerLabelComparator.EQUAL:
      return 'EQUAL';
    case WorkerLabelComparator.NOT_EQUAL:
      return 'NOT_EQUAL';
    case WorkerLabelComparator.GREATER_THAN:
      return 'GREATER_THAN';
    case WorkerLabelComparator.GREATER_THAN_OR_EQUAL:
      return 'GREATER_THAN_OR_EQUAL';
    case WorkerLabelComparator.LESS_THAN:
      return 'LESS_THAN';
    case WorkerLabelComparator.LESS_THAN_OR_EQUAL:
      return 'LESS_THAN_OR_EQUAL';
    case WorkerLabelComparator.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export enum RateLimitDuration {
  SECOND = 0,
  MINUTE = 1,
  HOUR = 2,
  DAY = 3,
  WEEK = 4,
  MONTH = 5,
  YEAR = 6,
  UNRECOGNIZED = -1,
}

export function rateLimitDurationFromJSON(object: any): RateLimitDuration {
  switch (object) {
    case 0:
    case 'SECOND':
      return RateLimitDuration.SECOND;
    case 1:
    case 'MINUTE':
      return RateLimitDuration.MINUTE;
    case 2:
    case 'HOUR':
      return RateLimitDuration.HOUR;
    case 3:
    case 'DAY':
      return RateLimitDuration.DAY;
    case 4:
    case 'WEEK':
      return RateLimitDuration.WEEK;
    case 5:
    case 'MONTH':
      return RateLimitDuration.MONTH;
    case 6:
    case 'YEAR':
      return RateLimitDuration.YEAR;
    case -1:
    case 'UNRECOGNIZED':
    default:
      return RateLimitDuration.UNRECOGNIZED;
  }
}

export function rateLimitDurationToJSON(object: RateLimitDuration): string {
  switch (object) {
    case RateLimitDuration.SECOND:
      return 'SECOND';
    case RateLimitDuration.MINUTE:
      return 'MINUTE';
    case RateLimitDuration.HOUR:
      return 'HOUR';
    case RateLimitDuration.DAY:
      return 'DAY';
    case RateLimitDuration.WEEK:
      return 'WEEK';
    case RateLimitDuration.MONTH:
      return 'MONTH';
    case RateLimitDuration.YEAR:
      return 'YEAR';
    case RateLimitDuration.UNRECOGNIZED:
    default:
      return 'UNRECOGNIZED';
  }
}

export interface PutWorkflowRequest {
  opts: CreateWorkflowVersionOpts | undefined;
}

/** CreateWorkflowVersionOpts represents options to create a workflow version. */
export interface CreateWorkflowVersionOpts {
  /** (required) the workflow name */
  name: string;
  /** (optional) the workflow description */
  description: string;
  /** (required) the workflow version */
  version: string;
  /** (optional) event triggers for the workflow */
  eventTriggers: string[];
  /** (optional) cron triggers for the workflow */
  cronTriggers: string[];
  /** (optional) scheduled triggers for the workflow */
  scheduledTriggers: Date[];
  /** (required) the workflow jobs */
  jobs: CreateWorkflowJobOpts[];
  /** (optional) the workflow concurrency options */
  concurrency: WorkflowConcurrencyOpts | undefined;
  /** (optional) the timeout for the schedule */
  scheduleTimeout?: string | undefined;
  /** (optional) the input for the cron trigger */
  cronInput?: string | undefined;
  /** (optional) the job to run on failure */
  onFailureJob?: CreateWorkflowJobOpts | undefined;
  /** (optional) the sticky strategy for assigning steps to workers */
  sticky?: StickyStrategy | undefined;
  /** (optional) the kind of workflow */
  kind?: WorkflowKind | undefined;
}

export interface WorkflowConcurrencyOpts {
  /** (required) the action id for getting the concurrency group */
  action: string;
  /** (optional) the maximum number of concurrent workflow runs, default 1 */
  maxRuns: number;
  /** (optional) the strategy to use when the concurrency limit is reached, default CANCEL_IN_PROGRESS */
  limitStrategy: ConcurrencyLimitStrategy;
}

/** CreateWorkflowJobOpts represents options to create a workflow job. */
export interface CreateWorkflowJobOpts {
  /** (required) the job name */
  name: string;
  /** (optional) the job description */
  description: string;
  /** (required) the job steps */
  steps: CreateWorkflowStepOpts[];
}

export interface DesiredWorkerLabels {
  /** value of the affinity */
  strValue?: string | undefined;
  intValue?: number | undefined;
  /**
   * (optional) Specifies whether the affinity setting is required.
   * If required, the worker will not accept actions that do not have a truthy affinity setting.
   *
   * Defaults to false.
   */
  required?: boolean | undefined;
  /**
   * (optional) Specifies the comparator for the affinity setting.
   * If not set, the default is EQUAL.
   */
  comparator?: WorkerLabelComparator | undefined;
  /**
   * (optional) Specifies the weight of the affinity setting.
   * If not set, the default is 100.
   */
  weight?: number | undefined;
}

/** CreateWorkflowStepOpts represents options to create a workflow step. */
export interface CreateWorkflowStepOpts {
  /** (required) the step name */
  readableId: string;
  /** (required) the step action id */
  action: string;
  /** (optional) the step timeout */
  timeout: string;
  /** (optional) the step inputs, assuming string representation of JSON */
  inputs: string;
  /** (optional) the step parents. if none are passed in, this is a root step */
  parents: string[];
  /** (optional) the custom step user data, assuming string representation of JSON */
  userData: string;
  /** (optional) the number of retries for the step, default 0 */
  retries: number;
  /** (optional) the rate limits for the step */
  rateLimits: CreateStepRateLimit[];
  /** (optional) the desired worker affinity state for the step */
  workerLabels: { [key: string]: DesiredWorkerLabels };
}

export interface CreateWorkflowStepOpts_WorkerLabelsEntry {
  key: string;
  value: DesiredWorkerLabels | undefined;
}

export interface CreateStepRateLimit {
  /** (required) the key for the rate limit */
  key: string;
  /** (required) the number of units this step consumes */
  units: number;
}

/** ListWorkflowsRequest is the request for ListWorkflows. */
export interface ListWorkflowsRequest {}

export interface ScheduleWorkflowRequest {
  name: string;
  schedules: Date[];
  /** (optional) the input data for the workflow */
  input: string;
  /** (optional) the parent workflow run id */
  parentId?: string | undefined;
  /** (optional) the parent step run id */
  parentStepRunId?: string | undefined;
  /**
   * (optional) the index of the child workflow. if this is set, matches on the index or the
   * child key will be a no-op, even if the schedule has changed.
   */
  childIndex?: number | undefined;
  /**
   * (optional) the key for the child. if this is set, matches on the index or the
   * child key will be a no-op, even if the schedule has changed.
   */
  childKey?: string | undefined;
}

/** WorkflowVersion represents the WorkflowVersion model. */
export interface WorkflowVersion {
  id: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  version: string;
  order: number;
  workflowId: string;
}

/** WorkflowTriggerEventRef represents the WorkflowTriggerEventRef model. */
export interface WorkflowTriggerEventRef {
  parentId: string;
  eventKey: string;
}

/** WorkflowTriggerCronRef represents the WorkflowTriggerCronRef model. */
export interface WorkflowTriggerCronRef {
  parentId: string;
  cron: string;
}

export interface TriggerWorkflowRequest {
  name: string;
  /** (optional) the input data for the workflow */
  input: string;
  /** (optional) the parent workflow run id */
  parentId?: string | undefined;
  /** (optional) the parent step run id */
  parentStepRunId?: string | undefined;
  /**
   * (optional) the index of the child workflow. if this is set, matches on the index or the
   * child key will return an existing workflow run if the parent id, parent step run id, and
   * child index/key match an existing workflow run.
   */
  childIndex?: number | undefined;
  /**
   * (optional) the key for the child. if this is set, matches on the index or the
   * child key will return an existing workflow run if the parent id, parent step run id, and
   * child index/key match an existing workflow run.
   */
  childKey?: string | undefined;
  /** (optional) additional metadata for the workflow */
  additionalMetadata?: string | undefined;
  /**
   * (optional) desired worker id for the workflow run,
   * requires the workflow definition to have a sticky strategy
   */
  desiredWorkerId?: string | undefined;
}

export interface TriggerWorkflowResponse {
  workflowRunId: string;
}

export interface PutRateLimitRequest {
  /** (required) the global key for the rate limit */
  key: string;
  /** (required) the max limit for the rate limit (per unit of time) */
  limit: number;
  /** (required) the duration of time for the rate limit (second|minute|hour) */
  duration: RateLimitDuration;
}

export interface PutRateLimitResponse {}

function createBasePutWorkflowRequest(): PutWorkflowRequest {
  return { opts: undefined };
}

export const PutWorkflowRequest = {
  encode(message: PutWorkflowRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.opts !== undefined) {
      CreateWorkflowVersionOpts.encode(message.opts, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PutWorkflowRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePutWorkflowRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.opts = CreateWorkflowVersionOpts.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PutWorkflowRequest {
    return {
      opts: isSet(object.opts) ? CreateWorkflowVersionOpts.fromJSON(object.opts) : undefined,
    };
  },

  toJSON(message: PutWorkflowRequest): unknown {
    const obj: any = {};
    if (message.opts !== undefined) {
      obj.opts = CreateWorkflowVersionOpts.toJSON(message.opts);
    }
    return obj;
  },

  create(base?: DeepPartial<PutWorkflowRequest>): PutWorkflowRequest {
    return PutWorkflowRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<PutWorkflowRequest>): PutWorkflowRequest {
    const message = createBasePutWorkflowRequest();
    message.opts =
      object.opts !== undefined && object.opts !== null
        ? CreateWorkflowVersionOpts.fromPartial(object.opts)
        : undefined;
    return message;
  },
};

function createBaseCreateWorkflowVersionOpts(): CreateWorkflowVersionOpts {
  return {
    name: '',
    description: '',
    version: '',
    eventTriggers: [],
    cronTriggers: [],
    scheduledTriggers: [],
    jobs: [],
    concurrency: undefined,
    scheduleTimeout: undefined,
    cronInput: undefined,
    onFailureJob: undefined,
    sticky: undefined,
    kind: undefined,
  };
}

export const CreateWorkflowVersionOpts = {
  encode(message: CreateWorkflowVersionOpts, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name);
    }
    if (message.description !== '') {
      writer.uint32(18).string(message.description);
    }
    if (message.version !== '') {
      writer.uint32(26).string(message.version);
    }
    for (const v of message.eventTriggers) {
      writer.uint32(34).string(v!);
    }
    for (const v of message.cronTriggers) {
      writer.uint32(42).string(v!);
    }
    for (const v of message.scheduledTriggers) {
      Timestamp.encode(toTimestamp(v!), writer.uint32(50).fork()).ldelim();
    }
    for (const v of message.jobs) {
      CreateWorkflowJobOpts.encode(v!, writer.uint32(58).fork()).ldelim();
    }
    if (message.concurrency !== undefined) {
      WorkflowConcurrencyOpts.encode(message.concurrency, writer.uint32(66).fork()).ldelim();
    }
    if (message.scheduleTimeout !== undefined) {
      writer.uint32(74).string(message.scheduleTimeout);
    }
    if (message.cronInput !== undefined) {
      writer.uint32(82).string(message.cronInput);
    }
    if (message.onFailureJob !== undefined) {
      CreateWorkflowJobOpts.encode(message.onFailureJob, writer.uint32(90).fork()).ldelim();
    }
    if (message.sticky !== undefined) {
      writer.uint32(96).int32(message.sticky);
    }
    if (message.kind !== undefined) {
      writer.uint32(104).int32(message.kind);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateWorkflowVersionOpts {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateWorkflowVersionOpts();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.description = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.version = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.eventTriggers.push(reader.string());
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.cronTriggers.push(reader.string());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.scheduledTriggers.push(fromTimestamp(Timestamp.decode(reader, reader.uint32())));
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.jobs.push(CreateWorkflowJobOpts.decode(reader, reader.uint32()));
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.concurrency = WorkflowConcurrencyOpts.decode(reader, reader.uint32());
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          message.scheduleTimeout = reader.string();
          continue;
        case 10:
          if (tag !== 82) {
            break;
          }

          message.cronInput = reader.string();
          continue;
        case 11:
          if (tag !== 90) {
            break;
          }

          message.onFailureJob = CreateWorkflowJobOpts.decode(reader, reader.uint32());
          continue;
        case 12:
          if (tag !== 96) {
            break;
          }

          message.sticky = reader.int32() as any;
          continue;
        case 13:
          if (tag !== 104) {
            break;
          }

          message.kind = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateWorkflowVersionOpts {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : '',
      description: isSet(object.description) ? globalThis.String(object.description) : '',
      version: isSet(object.version) ? globalThis.String(object.version) : '',
      eventTriggers: globalThis.Array.isArray(object?.eventTriggers)
        ? object.eventTriggers.map((e: any) => globalThis.String(e))
        : [],
      cronTriggers: globalThis.Array.isArray(object?.cronTriggers)
        ? object.cronTriggers.map((e: any) => globalThis.String(e))
        : [],
      scheduledTriggers: globalThis.Array.isArray(object?.scheduledTriggers)
        ? object.scheduledTriggers.map((e: any) => fromJsonTimestamp(e))
        : [],
      jobs: globalThis.Array.isArray(object?.jobs)
        ? object.jobs.map((e: any) => CreateWorkflowJobOpts.fromJSON(e))
        : [],
      concurrency: isSet(object.concurrency)
        ? WorkflowConcurrencyOpts.fromJSON(object.concurrency)
        : undefined,
      scheduleTimeout: isSet(object.scheduleTimeout)
        ? globalThis.String(object.scheduleTimeout)
        : undefined,
      cronInput: isSet(object.cronInput) ? globalThis.String(object.cronInput) : undefined,
      onFailureJob: isSet(object.onFailureJob)
        ? CreateWorkflowJobOpts.fromJSON(object.onFailureJob)
        : undefined,
      sticky: isSet(object.sticky) ? stickyStrategyFromJSON(object.sticky) : undefined,
      kind: isSet(object.kind) ? workflowKindFromJSON(object.kind) : undefined,
    };
  },

  toJSON(message: CreateWorkflowVersionOpts): unknown {
    const obj: any = {};
    if (message.name !== '') {
      obj.name = message.name;
    }
    if (message.description !== '') {
      obj.description = message.description;
    }
    if (message.version !== '') {
      obj.version = message.version;
    }
    if (message.eventTriggers?.length) {
      obj.eventTriggers = message.eventTriggers;
    }
    if (message.cronTriggers?.length) {
      obj.cronTriggers = message.cronTriggers;
    }
    if (message.scheduledTriggers?.length) {
      obj.scheduledTriggers = message.scheduledTriggers.map((e) => e.toISOString());
    }
    if (message.jobs?.length) {
      obj.jobs = message.jobs.map((e) => CreateWorkflowJobOpts.toJSON(e));
    }
    if (message.concurrency !== undefined) {
      obj.concurrency = WorkflowConcurrencyOpts.toJSON(message.concurrency);
    }
    if (message.scheduleTimeout !== undefined) {
      obj.scheduleTimeout = message.scheduleTimeout;
    }
    if (message.cronInput !== undefined) {
      obj.cronInput = message.cronInput;
    }
    if (message.onFailureJob !== undefined) {
      obj.onFailureJob = CreateWorkflowJobOpts.toJSON(message.onFailureJob);
    }
    if (message.sticky !== undefined) {
      obj.sticky = stickyStrategyToJSON(message.sticky);
    }
    if (message.kind !== undefined) {
      obj.kind = workflowKindToJSON(message.kind);
    }
    return obj;
  },

  create(base?: DeepPartial<CreateWorkflowVersionOpts>): CreateWorkflowVersionOpts {
    return CreateWorkflowVersionOpts.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateWorkflowVersionOpts>): CreateWorkflowVersionOpts {
    const message = createBaseCreateWorkflowVersionOpts();
    message.name = object.name ?? '';
    message.description = object.description ?? '';
    message.version = object.version ?? '';
    message.eventTriggers = object.eventTriggers?.map((e) => e) || [];
    message.cronTriggers = object.cronTriggers?.map((e) => e) || [];
    message.scheduledTriggers = object.scheduledTriggers?.map((e) => e) || [];
    message.jobs = object.jobs?.map((e) => CreateWorkflowJobOpts.fromPartial(e)) || [];
    message.concurrency =
      object.concurrency !== undefined && object.concurrency !== null
        ? WorkflowConcurrencyOpts.fromPartial(object.concurrency)
        : undefined;
    message.scheduleTimeout = object.scheduleTimeout ?? undefined;
    message.cronInput = object.cronInput ?? undefined;
    message.onFailureJob =
      object.onFailureJob !== undefined && object.onFailureJob !== null
        ? CreateWorkflowJobOpts.fromPartial(object.onFailureJob)
        : undefined;
    message.sticky = object.sticky ?? undefined;
    message.kind = object.kind ?? undefined;
    return message;
  },
};

function createBaseWorkflowConcurrencyOpts(): WorkflowConcurrencyOpts {
  return { action: '', maxRuns: 0, limitStrategy: 0 };
}

export const WorkflowConcurrencyOpts = {
  encode(message: WorkflowConcurrencyOpts, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.action !== '') {
      writer.uint32(10).string(message.action);
    }
    if (message.maxRuns !== 0) {
      writer.uint32(16).int32(message.maxRuns);
    }
    if (message.limitStrategy !== 0) {
      writer.uint32(24).int32(message.limitStrategy);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WorkflowConcurrencyOpts {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWorkflowConcurrencyOpts();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.action = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.maxRuns = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.limitStrategy = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): WorkflowConcurrencyOpts {
    return {
      action: isSet(object.action) ? globalThis.String(object.action) : '',
      maxRuns: isSet(object.maxRuns) ? globalThis.Number(object.maxRuns) : 0,
      limitStrategy: isSet(object.limitStrategy)
        ? concurrencyLimitStrategyFromJSON(object.limitStrategy)
        : 0,
    };
  },

  toJSON(message: WorkflowConcurrencyOpts): unknown {
    const obj: any = {};
    if (message.action !== '') {
      obj.action = message.action;
    }
    if (message.maxRuns !== 0) {
      obj.maxRuns = Math.round(message.maxRuns);
    }
    if (message.limitStrategy !== 0) {
      obj.limitStrategy = concurrencyLimitStrategyToJSON(message.limitStrategy);
    }
    return obj;
  },

  create(base?: DeepPartial<WorkflowConcurrencyOpts>): WorkflowConcurrencyOpts {
    return WorkflowConcurrencyOpts.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<WorkflowConcurrencyOpts>): WorkflowConcurrencyOpts {
    const message = createBaseWorkflowConcurrencyOpts();
    message.action = object.action ?? '';
    message.maxRuns = object.maxRuns ?? 0;
    message.limitStrategy = object.limitStrategy ?? 0;
    return message;
  },
};

function createBaseCreateWorkflowJobOpts(): CreateWorkflowJobOpts {
  return { name: '', description: '', steps: [] };
}

export const CreateWorkflowJobOpts = {
  encode(message: CreateWorkflowJobOpts, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name);
    }
    if (message.description !== '') {
      writer.uint32(18).string(message.description);
    }
    for (const v of message.steps) {
      CreateWorkflowStepOpts.encode(v!, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateWorkflowJobOpts {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateWorkflowJobOpts();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.description = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.steps.push(CreateWorkflowStepOpts.decode(reader, reader.uint32()));
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateWorkflowJobOpts {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : '',
      description: isSet(object.description) ? globalThis.String(object.description) : '',
      steps: globalThis.Array.isArray(object?.steps)
        ? object.steps.map((e: any) => CreateWorkflowStepOpts.fromJSON(e))
        : [],
    };
  },

  toJSON(message: CreateWorkflowJobOpts): unknown {
    const obj: any = {};
    if (message.name !== '') {
      obj.name = message.name;
    }
    if (message.description !== '') {
      obj.description = message.description;
    }
    if (message.steps?.length) {
      obj.steps = message.steps.map((e) => CreateWorkflowStepOpts.toJSON(e));
    }
    return obj;
  },

  create(base?: DeepPartial<CreateWorkflowJobOpts>): CreateWorkflowJobOpts {
    return CreateWorkflowJobOpts.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateWorkflowJobOpts>): CreateWorkflowJobOpts {
    const message = createBaseCreateWorkflowJobOpts();
    message.name = object.name ?? '';
    message.description = object.description ?? '';
    message.steps = object.steps?.map((e) => CreateWorkflowStepOpts.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDesiredWorkerLabels(): DesiredWorkerLabels {
  return {
    strValue: undefined,
    intValue: undefined,
    required: undefined,
    comparator: undefined,
    weight: undefined,
  };
}

export const DesiredWorkerLabels = {
  encode(message: DesiredWorkerLabels, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.strValue !== undefined) {
      writer.uint32(10).string(message.strValue);
    }
    if (message.intValue !== undefined) {
      writer.uint32(16).int32(message.intValue);
    }
    if (message.required !== undefined) {
      writer.uint32(24).bool(message.required);
    }
    if (message.comparator !== undefined) {
      writer.uint32(32).int32(message.comparator);
    }
    if (message.weight !== undefined) {
      writer.uint32(40).int32(message.weight);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DesiredWorkerLabels {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDesiredWorkerLabels();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.strValue = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.intValue = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.required = reader.bool();
          continue;
        case 4:
          if (tag !== 32) {
            break;
          }

          message.comparator = reader.int32() as any;
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.weight = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): DesiredWorkerLabels {
    return {
      strValue: isSet(object.strValue) ? globalThis.String(object.strValue) : undefined,
      intValue: isSet(object.intValue) ? globalThis.Number(object.intValue) : undefined,
      required: isSet(object.required) ? globalThis.Boolean(object.required) : undefined,
      comparator: isSet(object.comparator)
        ? workerLabelComparatorFromJSON(object.comparator)
        : undefined,
      weight: isSet(object.weight) ? globalThis.Number(object.weight) : undefined,
    };
  },

  toJSON(message: DesiredWorkerLabels): unknown {
    const obj: any = {};
    if (message.strValue !== undefined) {
      obj.strValue = message.strValue;
    }
    if (message.intValue !== undefined) {
      obj.intValue = Math.round(message.intValue);
    }
    if (message.required !== undefined) {
      obj.required = message.required;
    }
    if (message.comparator !== undefined) {
      obj.comparator = workerLabelComparatorToJSON(message.comparator);
    }
    if (message.weight !== undefined) {
      obj.weight = Math.round(message.weight);
    }
    return obj;
  },

  create(base?: DeepPartial<DesiredWorkerLabels>): DesiredWorkerLabels {
    return DesiredWorkerLabels.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<DesiredWorkerLabels>): DesiredWorkerLabels {
    const message = createBaseDesiredWorkerLabels();
    message.strValue = object.strValue ?? undefined;
    message.intValue = object.intValue ?? undefined;
    message.required = object.required ?? undefined;
    message.comparator = object.comparator ?? undefined;
    message.weight = object.weight ?? undefined;
    return message;
  },
};

function createBaseCreateWorkflowStepOpts(): CreateWorkflowStepOpts {
  return {
    readableId: '',
    action: '',
    timeout: '',
    inputs: '',
    parents: [],
    userData: '',
    retries: 0,
    rateLimits: [],
    workerLabels: {},
  };
}

export const CreateWorkflowStepOpts = {
  encode(message: CreateWorkflowStepOpts, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.readableId !== '') {
      writer.uint32(10).string(message.readableId);
    }
    if (message.action !== '') {
      writer.uint32(18).string(message.action);
    }
    if (message.timeout !== '') {
      writer.uint32(26).string(message.timeout);
    }
    if (message.inputs !== '') {
      writer.uint32(34).string(message.inputs);
    }
    for (const v of message.parents) {
      writer.uint32(42).string(v!);
    }
    if (message.userData !== '') {
      writer.uint32(50).string(message.userData);
    }
    if (message.retries !== 0) {
      writer.uint32(56).int32(message.retries);
    }
    for (const v of message.rateLimits) {
      CreateStepRateLimit.encode(v!, writer.uint32(66).fork()).ldelim();
    }
    Object.entries(message.workerLabels).forEach(([key, value]) => {
      CreateWorkflowStepOpts_WorkerLabelsEntry.encode(
        { key: key as any, value },
        writer.uint32(74).fork()
      ).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateWorkflowStepOpts {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateWorkflowStepOpts();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.readableId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.action = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.timeout = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.inputs = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.parents.push(reader.string());
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.userData = reader.string();
          continue;
        case 7:
          if (tag !== 56) {
            break;
          }

          message.retries = reader.int32();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.rateLimits.push(CreateStepRateLimit.decode(reader, reader.uint32()));
          continue;
        case 9:
          if (tag !== 74) {
            break;
          }

          const entry9 = CreateWorkflowStepOpts_WorkerLabelsEntry.decode(reader, reader.uint32());
          if (entry9.value !== undefined) {
            message.workerLabels[entry9.key] = entry9.value;
          }
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateWorkflowStepOpts {
    return {
      readableId: isSet(object.readableId) ? globalThis.String(object.readableId) : '',
      action: isSet(object.action) ? globalThis.String(object.action) : '',
      timeout: isSet(object.timeout) ? globalThis.String(object.timeout) : '',
      inputs: isSet(object.inputs) ? globalThis.String(object.inputs) : '',
      parents: globalThis.Array.isArray(object?.parents)
        ? object.parents.map((e: any) => globalThis.String(e))
        : [],
      userData: isSet(object.userData) ? globalThis.String(object.userData) : '',
      retries: isSet(object.retries) ? globalThis.Number(object.retries) : 0,
      rateLimits: globalThis.Array.isArray(object?.rateLimits)
        ? object.rateLimits.map((e: any) => CreateStepRateLimit.fromJSON(e))
        : [],
      workerLabels: isObject(object.workerLabels)
        ? Object.entries(object.workerLabels).reduce<{ [key: string]: DesiredWorkerLabels }>(
            (acc, [key, value]) => {
              acc[key] = DesiredWorkerLabels.fromJSON(value);
              return acc;
            },
            {}
          )
        : {},
    };
  },

  toJSON(message: CreateWorkflowStepOpts): unknown {
    const obj: any = {};
    if (message.readableId !== '') {
      obj.readableId = message.readableId;
    }
    if (message.action !== '') {
      obj.action = message.action;
    }
    if (message.timeout !== '') {
      obj.timeout = message.timeout;
    }
    if (message.inputs !== '') {
      obj.inputs = message.inputs;
    }
    if (message.parents?.length) {
      obj.parents = message.parents;
    }
    if (message.userData !== '') {
      obj.userData = message.userData;
    }
    if (message.retries !== 0) {
      obj.retries = Math.round(message.retries);
    }
    if (message.rateLimits?.length) {
      obj.rateLimits = message.rateLimits.map((e) => CreateStepRateLimit.toJSON(e));
    }
    if (message.workerLabels) {
      const entries = Object.entries(message.workerLabels);
      if (entries.length > 0) {
        obj.workerLabels = {};
        entries.forEach(([k, v]) => {
          obj.workerLabels[k] = DesiredWorkerLabels.toJSON(v);
        });
      }
    }
    return obj;
  },

  create(base?: DeepPartial<CreateWorkflowStepOpts>): CreateWorkflowStepOpts {
    return CreateWorkflowStepOpts.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateWorkflowStepOpts>): CreateWorkflowStepOpts {
    const message = createBaseCreateWorkflowStepOpts();
    message.readableId = object.readableId ?? '';
    message.action = object.action ?? '';
    message.timeout = object.timeout ?? '';
    message.inputs = object.inputs ?? '';
    message.parents = object.parents?.map((e) => e) || [];
    message.userData = object.userData ?? '';
    message.retries = object.retries ?? 0;
    message.rateLimits = object.rateLimits?.map((e) => CreateStepRateLimit.fromPartial(e)) || [];
    message.workerLabels = Object.entries(object.workerLabels ?? {}).reduce<{
      [key: string]: DesiredWorkerLabels;
    }>((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = DesiredWorkerLabels.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseCreateWorkflowStepOpts_WorkerLabelsEntry(): CreateWorkflowStepOpts_WorkerLabelsEntry {
  return { key: '', value: undefined };
}

export const CreateWorkflowStepOpts_WorkerLabelsEntry = {
  encode(
    message: CreateWorkflowStepOpts_WorkerLabelsEntry,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      DesiredWorkerLabels.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): CreateWorkflowStepOpts_WorkerLabelsEntry {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateWorkflowStepOpts_WorkerLabelsEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.value = DesiredWorkerLabels.decode(reader, reader.uint32());
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateWorkflowStepOpts_WorkerLabelsEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : '',
      value: isSet(object.value) ? DesiredWorkerLabels.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: CreateWorkflowStepOpts_WorkerLabelsEntry): unknown {
    const obj: any = {};
    if (message.key !== '') {
      obj.key = message.key;
    }
    if (message.value !== undefined) {
      obj.value = DesiredWorkerLabels.toJSON(message.value);
    }
    return obj;
  },

  create(
    base?: DeepPartial<CreateWorkflowStepOpts_WorkerLabelsEntry>
  ): CreateWorkflowStepOpts_WorkerLabelsEntry {
    return CreateWorkflowStepOpts_WorkerLabelsEntry.fromPartial(base ?? {});
  },
  fromPartial(
    object: DeepPartial<CreateWorkflowStepOpts_WorkerLabelsEntry>
  ): CreateWorkflowStepOpts_WorkerLabelsEntry {
    const message = createBaseCreateWorkflowStepOpts_WorkerLabelsEntry();
    message.key = object.key ?? '';
    message.value =
      object.value !== undefined && object.value !== null
        ? DesiredWorkerLabels.fromPartial(object.value)
        : undefined;
    return message;
  },
};

function createBaseCreateStepRateLimit(): CreateStepRateLimit {
  return { key: '', units: 0 };
}

export const CreateStepRateLimit = {
  encode(message: CreateStepRateLimit, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key);
    }
    if (message.units !== 0) {
      writer.uint32(16).int32(message.units);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateStepRateLimit {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseCreateStepRateLimit();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.units = reader.int32();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): CreateStepRateLimit {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : '',
      units: isSet(object.units) ? globalThis.Number(object.units) : 0,
    };
  },

  toJSON(message: CreateStepRateLimit): unknown {
    const obj: any = {};
    if (message.key !== '') {
      obj.key = message.key;
    }
    if (message.units !== 0) {
      obj.units = Math.round(message.units);
    }
    return obj;
  },

  create(base?: DeepPartial<CreateStepRateLimit>): CreateStepRateLimit {
    return CreateStepRateLimit.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateStepRateLimit>): CreateStepRateLimit {
    const message = createBaseCreateStepRateLimit();
    message.key = object.key ?? '';
    message.units = object.units ?? 0;
    return message;
  },
};

function createBaseListWorkflowsRequest(): ListWorkflowsRequest {
  return {};
}

export const ListWorkflowsRequest = {
  encode(_: ListWorkflowsRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ListWorkflowsRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseListWorkflowsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): ListWorkflowsRequest {
    return {};
  },

  toJSON(_: ListWorkflowsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<ListWorkflowsRequest>): ListWorkflowsRequest {
    return ListWorkflowsRequest.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<ListWorkflowsRequest>): ListWorkflowsRequest {
    const message = createBaseListWorkflowsRequest();
    return message;
  },
};

function createBaseScheduleWorkflowRequest(): ScheduleWorkflowRequest {
  return {
    name: '',
    schedules: [],
    input: '',
    parentId: undefined,
    parentStepRunId: undefined,
    childIndex: undefined,
    childKey: undefined,
  };
}

export const ScheduleWorkflowRequest = {
  encode(message: ScheduleWorkflowRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name);
    }
    for (const v of message.schedules) {
      Timestamp.encode(toTimestamp(v!), writer.uint32(18).fork()).ldelim();
    }
    if (message.input !== '') {
      writer.uint32(26).string(message.input);
    }
    if (message.parentId !== undefined) {
      writer.uint32(34).string(message.parentId);
    }
    if (message.parentStepRunId !== undefined) {
      writer.uint32(42).string(message.parentStepRunId);
    }
    if (message.childIndex !== undefined) {
      writer.uint32(48).int32(message.childIndex);
    }
    if (message.childKey !== undefined) {
      writer.uint32(58).string(message.childKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ScheduleWorkflowRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseScheduleWorkflowRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.schedules.push(fromTimestamp(Timestamp.decode(reader, reader.uint32())));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.input = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.parentId = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.parentStepRunId = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.childIndex = reader.int32();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.childKey = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ScheduleWorkflowRequest {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : '',
      schedules: globalThis.Array.isArray(object?.schedules)
        ? object.schedules.map((e: any) => fromJsonTimestamp(e))
        : [],
      input: isSet(object.input) ? globalThis.String(object.input) : '',
      parentId: isSet(object.parentId) ? globalThis.String(object.parentId) : undefined,
      parentStepRunId: isSet(object.parentStepRunId)
        ? globalThis.String(object.parentStepRunId)
        : undefined,
      childIndex: isSet(object.childIndex) ? globalThis.Number(object.childIndex) : undefined,
      childKey: isSet(object.childKey) ? globalThis.String(object.childKey) : undefined,
    };
  },

  toJSON(message: ScheduleWorkflowRequest): unknown {
    const obj: any = {};
    if (message.name !== '') {
      obj.name = message.name;
    }
    if (message.schedules?.length) {
      obj.schedules = message.schedules.map((e) => e.toISOString());
    }
    if (message.input !== '') {
      obj.input = message.input;
    }
    if (message.parentId !== undefined) {
      obj.parentId = message.parentId;
    }
    if (message.parentStepRunId !== undefined) {
      obj.parentStepRunId = message.parentStepRunId;
    }
    if (message.childIndex !== undefined) {
      obj.childIndex = Math.round(message.childIndex);
    }
    if (message.childKey !== undefined) {
      obj.childKey = message.childKey;
    }
    return obj;
  },

  create(base?: DeepPartial<ScheduleWorkflowRequest>): ScheduleWorkflowRequest {
    return ScheduleWorkflowRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ScheduleWorkflowRequest>): ScheduleWorkflowRequest {
    const message = createBaseScheduleWorkflowRequest();
    message.name = object.name ?? '';
    message.schedules = object.schedules?.map((e) => e) || [];
    message.input = object.input ?? '';
    message.parentId = object.parentId ?? undefined;
    message.parentStepRunId = object.parentStepRunId ?? undefined;
    message.childIndex = object.childIndex ?? undefined;
    message.childKey = object.childKey ?? undefined;
    return message;
  },
};

function createBaseWorkflowVersion(): WorkflowVersion {
  return {
    id: '',
    createdAt: undefined,
    updatedAt: undefined,
    version: '',
    order: 0,
    workflowId: '',
  };
}

export const WorkflowVersion = {
  encode(message: WorkflowVersion, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== '') {
      writer.uint32(10).string(message.id);
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(18).fork()).ldelim();
    }
    if (message.updatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.updatedAt), writer.uint32(26).fork()).ldelim();
    }
    if (message.version !== '') {
      writer.uint32(42).string(message.version);
    }
    if (message.order !== 0) {
      writer.uint32(48).int32(message.order);
    }
    if (message.workflowId !== '') {
      writer.uint32(58).string(message.workflowId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WorkflowVersion {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWorkflowVersion();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.createdAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.updatedAt = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.version = reader.string();
          continue;
        case 6:
          if (tag !== 48) {
            break;
          }

          message.order = reader.int32();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.workflowId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): WorkflowVersion {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : '',
      createdAt: isSet(object.createdAt) ? fromJsonTimestamp(object.createdAt) : undefined,
      updatedAt: isSet(object.updatedAt) ? fromJsonTimestamp(object.updatedAt) : undefined,
      version: isSet(object.version) ? globalThis.String(object.version) : '',
      order: isSet(object.order) ? globalThis.Number(object.order) : 0,
      workflowId: isSet(object.workflowId) ? globalThis.String(object.workflowId) : '',
    };
  },

  toJSON(message: WorkflowVersion): unknown {
    const obj: any = {};
    if (message.id !== '') {
      obj.id = message.id;
    }
    if (message.createdAt !== undefined) {
      obj.createdAt = message.createdAt.toISOString();
    }
    if (message.updatedAt !== undefined) {
      obj.updatedAt = message.updatedAt.toISOString();
    }
    if (message.version !== '') {
      obj.version = message.version;
    }
    if (message.order !== 0) {
      obj.order = Math.round(message.order);
    }
    if (message.workflowId !== '') {
      obj.workflowId = message.workflowId;
    }
    return obj;
  },

  create(base?: DeepPartial<WorkflowVersion>): WorkflowVersion {
    return WorkflowVersion.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<WorkflowVersion>): WorkflowVersion {
    const message = createBaseWorkflowVersion();
    message.id = object.id ?? '';
    message.createdAt = object.createdAt ?? undefined;
    message.updatedAt = object.updatedAt ?? undefined;
    message.version = object.version ?? '';
    message.order = object.order ?? 0;
    message.workflowId = object.workflowId ?? '';
    return message;
  },
};

function createBaseWorkflowTriggerEventRef(): WorkflowTriggerEventRef {
  return { parentId: '', eventKey: '' };
}

export const WorkflowTriggerEventRef = {
  encode(message: WorkflowTriggerEventRef, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.parentId !== '') {
      writer.uint32(10).string(message.parentId);
    }
    if (message.eventKey !== '') {
      writer.uint32(18).string(message.eventKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WorkflowTriggerEventRef {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWorkflowTriggerEventRef();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.parentId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.eventKey = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): WorkflowTriggerEventRef {
    return {
      parentId: isSet(object.parentId) ? globalThis.String(object.parentId) : '',
      eventKey: isSet(object.eventKey) ? globalThis.String(object.eventKey) : '',
    };
  },

  toJSON(message: WorkflowTriggerEventRef): unknown {
    const obj: any = {};
    if (message.parentId !== '') {
      obj.parentId = message.parentId;
    }
    if (message.eventKey !== '') {
      obj.eventKey = message.eventKey;
    }
    return obj;
  },

  create(base?: DeepPartial<WorkflowTriggerEventRef>): WorkflowTriggerEventRef {
    return WorkflowTriggerEventRef.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<WorkflowTriggerEventRef>): WorkflowTriggerEventRef {
    const message = createBaseWorkflowTriggerEventRef();
    message.parentId = object.parentId ?? '';
    message.eventKey = object.eventKey ?? '';
    return message;
  },
};

function createBaseWorkflowTriggerCronRef(): WorkflowTriggerCronRef {
  return { parentId: '', cron: '' };
}

export const WorkflowTriggerCronRef = {
  encode(message: WorkflowTriggerCronRef, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.parentId !== '') {
      writer.uint32(10).string(message.parentId);
    }
    if (message.cron !== '') {
      writer.uint32(18).string(message.cron);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WorkflowTriggerCronRef {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseWorkflowTriggerCronRef();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.parentId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.cron = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): WorkflowTriggerCronRef {
    return {
      parentId: isSet(object.parentId) ? globalThis.String(object.parentId) : '',
      cron: isSet(object.cron) ? globalThis.String(object.cron) : '',
    };
  },

  toJSON(message: WorkflowTriggerCronRef): unknown {
    const obj: any = {};
    if (message.parentId !== '') {
      obj.parentId = message.parentId;
    }
    if (message.cron !== '') {
      obj.cron = message.cron;
    }
    return obj;
  },

  create(base?: DeepPartial<WorkflowTriggerCronRef>): WorkflowTriggerCronRef {
    return WorkflowTriggerCronRef.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<WorkflowTriggerCronRef>): WorkflowTriggerCronRef {
    const message = createBaseWorkflowTriggerCronRef();
    message.parentId = object.parentId ?? '';
    message.cron = object.cron ?? '';
    return message;
  },
};

function createBaseTriggerWorkflowRequest(): TriggerWorkflowRequest {
  return {
    name: '',
    input: '',
    parentId: undefined,
    parentStepRunId: undefined,
    childIndex: undefined,
    childKey: undefined,
    additionalMetadata: undefined,
    desiredWorkerId: undefined,
  };
}

export const TriggerWorkflowRequest = {
  encode(message: TriggerWorkflowRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== '') {
      writer.uint32(10).string(message.name);
    }
    if (message.input !== '') {
      writer.uint32(18).string(message.input);
    }
    if (message.parentId !== undefined) {
      writer.uint32(26).string(message.parentId);
    }
    if (message.parentStepRunId !== undefined) {
      writer.uint32(34).string(message.parentStepRunId);
    }
    if (message.childIndex !== undefined) {
      writer.uint32(40).int32(message.childIndex);
    }
    if (message.childKey !== undefined) {
      writer.uint32(50).string(message.childKey);
    }
    if (message.additionalMetadata !== undefined) {
      writer.uint32(58).string(message.additionalMetadata);
    }
    if (message.desiredWorkerId !== undefined) {
      writer.uint32(66).string(message.desiredWorkerId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TriggerWorkflowRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTriggerWorkflowRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.name = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.input = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.parentId = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.parentStepRunId = reader.string();
          continue;
        case 5:
          if (tag !== 40) {
            break;
          }

          message.childIndex = reader.int32();
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.childKey = reader.string();
          continue;
        case 7:
          if (tag !== 58) {
            break;
          }

          message.additionalMetadata = reader.string();
          continue;
        case 8:
          if (tag !== 66) {
            break;
          }

          message.desiredWorkerId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TriggerWorkflowRequest {
    return {
      name: isSet(object.name) ? globalThis.String(object.name) : '',
      input: isSet(object.input) ? globalThis.String(object.input) : '',
      parentId: isSet(object.parentId) ? globalThis.String(object.parentId) : undefined,
      parentStepRunId: isSet(object.parentStepRunId)
        ? globalThis.String(object.parentStepRunId)
        : undefined,
      childIndex: isSet(object.childIndex) ? globalThis.Number(object.childIndex) : undefined,
      childKey: isSet(object.childKey) ? globalThis.String(object.childKey) : undefined,
      additionalMetadata: isSet(object.additionalMetadata)
        ? globalThis.String(object.additionalMetadata)
        : undefined,
      desiredWorkerId: isSet(object.desiredWorkerId)
        ? globalThis.String(object.desiredWorkerId)
        : undefined,
    };
  },

  toJSON(message: TriggerWorkflowRequest): unknown {
    const obj: any = {};
    if (message.name !== '') {
      obj.name = message.name;
    }
    if (message.input !== '') {
      obj.input = message.input;
    }
    if (message.parentId !== undefined) {
      obj.parentId = message.parentId;
    }
    if (message.parentStepRunId !== undefined) {
      obj.parentStepRunId = message.parentStepRunId;
    }
    if (message.childIndex !== undefined) {
      obj.childIndex = Math.round(message.childIndex);
    }
    if (message.childKey !== undefined) {
      obj.childKey = message.childKey;
    }
    if (message.additionalMetadata !== undefined) {
      obj.additionalMetadata = message.additionalMetadata;
    }
    if (message.desiredWorkerId !== undefined) {
      obj.desiredWorkerId = message.desiredWorkerId;
    }
    return obj;
  },

  create(base?: DeepPartial<TriggerWorkflowRequest>): TriggerWorkflowRequest {
    return TriggerWorkflowRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<TriggerWorkflowRequest>): TriggerWorkflowRequest {
    const message = createBaseTriggerWorkflowRequest();
    message.name = object.name ?? '';
    message.input = object.input ?? '';
    message.parentId = object.parentId ?? undefined;
    message.parentStepRunId = object.parentStepRunId ?? undefined;
    message.childIndex = object.childIndex ?? undefined;
    message.childKey = object.childKey ?? undefined;
    message.additionalMetadata = object.additionalMetadata ?? undefined;
    message.desiredWorkerId = object.desiredWorkerId ?? undefined;
    return message;
  },
};

function createBaseTriggerWorkflowResponse(): TriggerWorkflowResponse {
  return { workflowRunId: '' };
}

export const TriggerWorkflowResponse = {
  encode(message: TriggerWorkflowResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.workflowRunId !== '') {
      writer.uint32(10).string(message.workflowRunId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TriggerWorkflowResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTriggerWorkflowResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.workflowRunId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): TriggerWorkflowResponse {
    return {
      workflowRunId: isSet(object.workflowRunId) ? globalThis.String(object.workflowRunId) : '',
    };
  },

  toJSON(message: TriggerWorkflowResponse): unknown {
    const obj: any = {};
    if (message.workflowRunId !== '') {
      obj.workflowRunId = message.workflowRunId;
    }
    return obj;
  },

  create(base?: DeepPartial<TriggerWorkflowResponse>): TriggerWorkflowResponse {
    return TriggerWorkflowResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<TriggerWorkflowResponse>): TriggerWorkflowResponse {
    const message = createBaseTriggerWorkflowResponse();
    message.workflowRunId = object.workflowRunId ?? '';
    return message;
  },
};

function createBasePutRateLimitRequest(): PutRateLimitRequest {
  return { key: '', limit: 0, duration: 0 };
}

export const PutRateLimitRequest = {
  encode(message: PutRateLimitRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key);
    }
    if (message.limit !== 0) {
      writer.uint32(16).int32(message.limit);
    }
    if (message.duration !== 0) {
      writer.uint32(24).int32(message.duration);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PutRateLimitRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePutRateLimitRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        case 2:
          if (tag !== 16) {
            break;
          }

          message.limit = reader.int32();
          continue;
        case 3:
          if (tag !== 24) {
            break;
          }

          message.duration = reader.int32() as any;
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PutRateLimitRequest {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : '',
      limit: isSet(object.limit) ? globalThis.Number(object.limit) : 0,
      duration: isSet(object.duration) ? rateLimitDurationFromJSON(object.duration) : 0,
    };
  },

  toJSON(message: PutRateLimitRequest): unknown {
    const obj: any = {};
    if (message.key !== '') {
      obj.key = message.key;
    }
    if (message.limit !== 0) {
      obj.limit = Math.round(message.limit);
    }
    if (message.duration !== 0) {
      obj.duration = rateLimitDurationToJSON(message.duration);
    }
    return obj;
  },

  create(base?: DeepPartial<PutRateLimitRequest>): PutRateLimitRequest {
    return PutRateLimitRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<PutRateLimitRequest>): PutRateLimitRequest {
    const message = createBasePutRateLimitRequest();
    message.key = object.key ?? '';
    message.limit = object.limit ?? 0;
    message.duration = object.duration ?? 0;
    return message;
  },
};

function createBasePutRateLimitResponse(): PutRateLimitResponse {
  return {};
}

export const PutRateLimitResponse = {
  encode(_: PutRateLimitResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PutRateLimitResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePutRateLimitResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): PutRateLimitResponse {
    return {};
  },

  toJSON(_: PutRateLimitResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<PutRateLimitResponse>): PutRateLimitResponse {
    return PutRateLimitResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<PutRateLimitResponse>): PutRateLimitResponse {
    const message = createBasePutRateLimitResponse();
    return message;
  },
};

/** WorkflowService represents a set of RPCs for managing workflows. */
export type WorkflowServiceDefinition = typeof WorkflowServiceDefinition;
export const WorkflowServiceDefinition = {
  name: 'WorkflowService',
  fullName: 'WorkflowService',
  methods: {
    putWorkflow: {
      name: 'PutWorkflow',
      requestType: PutWorkflowRequest,
      requestStream: false,
      responseType: WorkflowVersion,
      responseStream: false,
      options: {},
    },
    scheduleWorkflow: {
      name: 'ScheduleWorkflow',
      requestType: ScheduleWorkflowRequest,
      requestStream: false,
      responseType: WorkflowVersion,
      responseStream: false,
      options: {},
    },
    triggerWorkflow: {
      name: 'TriggerWorkflow',
      requestType: TriggerWorkflowRequest,
      requestStream: false,
      responseType: TriggerWorkflowResponse,
      responseStream: false,
      options: {},
    },
    putRateLimit: {
      name: 'PutRateLimit',
      requestType: PutRateLimitRequest,
      requestStream: false,
      responseType: PutRateLimitResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface WorkflowServiceImplementation<CallContextExt = {}> {
  putWorkflow(
    request: PutWorkflowRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<WorkflowVersion>>;
  scheduleWorkflow(
    request: ScheduleWorkflowRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<WorkflowVersion>>;
  triggerWorkflow(
    request: TriggerWorkflowRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<TriggerWorkflowResponse>>;
  putRateLimit(
    request: PutRateLimitRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<PutRateLimitResponse>>;
}

export interface WorkflowServiceClient<CallOptionsExt = {}> {
  putWorkflow(
    request: DeepPartial<PutWorkflowRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<WorkflowVersion>;
  scheduleWorkflow(
    request: DeepPartial<ScheduleWorkflowRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<WorkflowVersion>;
  triggerWorkflow(
    request: DeepPartial<TriggerWorkflowRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<TriggerWorkflowResponse>;
  putRateLimit(
    request: DeepPartial<PutRateLimitRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<PutRateLimitResponse>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends globalThis.Array<infer U>
    ? globalThis.Array<DeepPartial<U>>
    : T extends ReadonlyArray<infer U>
      ? ReadonlyArray<DeepPartial<U>>
      : T extends {}
        ? { [K in keyof T]?: DeepPartial<T[K]> }
        : Partial<T>;

function toTimestamp(date: Date): Timestamp {
  const seconds = Math.trunc(date.getTime() / 1_000);
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = (t.seconds || 0) * 1_000;
  millis += (t.nanos || 0) / 1_000_000;
  return new globalThis.Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof globalThis.Date) {
    return o;
  } else if (typeof o === 'string') {
    return new globalThis.Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isObject(value: any): boolean {
  return typeof value === 'object' && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
