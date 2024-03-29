/* eslint-disable */
import type { CallContext, CallOptions } from "nice-grpc-common";
import * as _m0 from "protobufjs/minimal";
import { Timestamp } from "../google/protobuf/timestamp";

export const protobufPackage = "";

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
    case "CANCEL_IN_PROGRESS":
      return ConcurrencyLimitStrategy.CANCEL_IN_PROGRESS;
    case 1:
    case "DROP_NEWEST":
      return ConcurrencyLimitStrategy.DROP_NEWEST;
    case 2:
    case "QUEUE_NEWEST":
      return ConcurrencyLimitStrategy.QUEUE_NEWEST;
    case 3:
    case "GROUP_ROUND_ROBIN":
      return ConcurrencyLimitStrategy.GROUP_ROUND_ROBIN;
    case -1:
    case "UNRECOGNIZED":
    default:
      return ConcurrencyLimitStrategy.UNRECOGNIZED;
  }
}

export function concurrencyLimitStrategyToJSON(object: ConcurrencyLimitStrategy): string {
  switch (object) {
    case ConcurrencyLimitStrategy.CANCEL_IN_PROGRESS:
      return "CANCEL_IN_PROGRESS";
    case ConcurrencyLimitStrategy.DROP_NEWEST:
      return "DROP_NEWEST";
    case ConcurrencyLimitStrategy.QUEUE_NEWEST:
      return "QUEUE_NEWEST";
    case ConcurrencyLimitStrategy.GROUP_ROUND_ROBIN:
      return "GROUP_ROUND_ROBIN";
    case ConcurrencyLimitStrategy.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
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
  concurrency:
    | WorkflowConcurrencyOpts
    | undefined;
  /** (optional) the timeout for the schedule */
  scheduleTimeout?: string | undefined;
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
  /** (optional) the job timeout */
  timeout: string;
  /** (required) the job steps */
  steps: CreateWorkflowStepOpts[];
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
}

/** ListWorkflowsRequest is the request for ListWorkflows. */
export interface ListWorkflowsRequest {
}

export interface ScheduleWorkflowRequest {
  name: string;
  schedules: Date[];
  /** (optional) the input data for the workflow */
  input: string;
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
}

export interface TriggerWorkflowResponse {
  workflowRunId: string;
}

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
    return { opts: isSet(object.opts) ? CreateWorkflowVersionOpts.fromJSON(object.opts) : undefined };
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
    message.opts = (object.opts !== undefined && object.opts !== null)
      ? CreateWorkflowVersionOpts.fromPartial(object.opts)
      : undefined;
    return message;
  },
};

function createBaseCreateWorkflowVersionOpts(): CreateWorkflowVersionOpts {
  return {
    name: "",
    description: "",
    version: "",
    eventTriggers: [],
    cronTriggers: [],
    scheduledTriggers: [],
    jobs: [],
    concurrency: undefined,
    scheduleTimeout: undefined,
  };
}

export const CreateWorkflowVersionOpts = {
  encode(message: CreateWorkflowVersionOpts, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.version !== "") {
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
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      version: isSet(object.version) ? globalThis.String(object.version) : "",
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
      concurrency: isSet(object.concurrency) ? WorkflowConcurrencyOpts.fromJSON(object.concurrency) : undefined,
      scheduleTimeout: isSet(object.scheduleTimeout) ? globalThis.String(object.scheduleTimeout) : undefined,
    };
  },

  toJSON(message: CreateWorkflowVersionOpts): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.version !== "") {
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
    return obj;
  },

  create(base?: DeepPartial<CreateWorkflowVersionOpts>): CreateWorkflowVersionOpts {
    return CreateWorkflowVersionOpts.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateWorkflowVersionOpts>): CreateWorkflowVersionOpts {
    const message = createBaseCreateWorkflowVersionOpts();
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.version = object.version ?? "";
    message.eventTriggers = object.eventTriggers?.map((e) => e) || [];
    message.cronTriggers = object.cronTriggers?.map((e) => e) || [];
    message.scheduledTriggers = object.scheduledTriggers?.map((e) => e) || [];
    message.jobs = object.jobs?.map((e) => CreateWorkflowJobOpts.fromPartial(e)) || [];
    message.concurrency = (object.concurrency !== undefined && object.concurrency !== null)
      ? WorkflowConcurrencyOpts.fromPartial(object.concurrency)
      : undefined;
    message.scheduleTimeout = object.scheduleTimeout ?? undefined;
    return message;
  },
};

function createBaseWorkflowConcurrencyOpts(): WorkflowConcurrencyOpts {
  return { action: "", maxRuns: 0, limitStrategy: 0 };
}

export const WorkflowConcurrencyOpts = {
  encode(message: WorkflowConcurrencyOpts, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.action !== "") {
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
      action: isSet(object.action) ? globalThis.String(object.action) : "",
      maxRuns: isSet(object.maxRuns) ? globalThis.Number(object.maxRuns) : 0,
      limitStrategy: isSet(object.limitStrategy) ? concurrencyLimitStrategyFromJSON(object.limitStrategy) : 0,
    };
  },

  toJSON(message: WorkflowConcurrencyOpts): unknown {
    const obj: any = {};
    if (message.action !== "") {
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
    message.action = object.action ?? "";
    message.maxRuns = object.maxRuns ?? 0;
    message.limitStrategy = object.limitStrategy ?? 0;
    return message;
  },
};

function createBaseCreateWorkflowJobOpts(): CreateWorkflowJobOpts {
  return { name: "", description: "", timeout: "", steps: [] };
}

export const CreateWorkflowJobOpts = {
  encode(message: CreateWorkflowJobOpts, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(18).string(message.description);
    }
    if (message.timeout !== "") {
      writer.uint32(26).string(message.timeout);
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
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      description: isSet(object.description) ? globalThis.String(object.description) : "",
      timeout: isSet(object.timeout) ? globalThis.String(object.timeout) : "",
      steps: globalThis.Array.isArray(object?.steps)
        ? object.steps.map((e: any) => CreateWorkflowStepOpts.fromJSON(e))
        : [],
    };
  },

  toJSON(message: CreateWorkflowJobOpts): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.description !== "") {
      obj.description = message.description;
    }
    if (message.timeout !== "") {
      obj.timeout = message.timeout;
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
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.timeout = object.timeout ?? "";
    message.steps = object.steps?.map((e) => CreateWorkflowStepOpts.fromPartial(e)) || [];
    return message;
  },
};

function createBaseCreateWorkflowStepOpts(): CreateWorkflowStepOpts {
  return { readableId: "", action: "", timeout: "", inputs: "", parents: [], userData: "", retries: 0 };
}

export const CreateWorkflowStepOpts = {
  encode(message: CreateWorkflowStepOpts, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.readableId !== "") {
      writer.uint32(10).string(message.readableId);
    }
    if (message.action !== "") {
      writer.uint32(18).string(message.action);
    }
    if (message.timeout !== "") {
      writer.uint32(26).string(message.timeout);
    }
    if (message.inputs !== "") {
      writer.uint32(34).string(message.inputs);
    }
    for (const v of message.parents) {
      writer.uint32(42).string(v!);
    }
    if (message.userData !== "") {
      writer.uint32(50).string(message.userData);
    }
    if (message.retries !== 0) {
      writer.uint32(56).int32(message.retries);
    }
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
      readableId: isSet(object.readableId) ? globalThis.String(object.readableId) : "",
      action: isSet(object.action) ? globalThis.String(object.action) : "",
      timeout: isSet(object.timeout) ? globalThis.String(object.timeout) : "",
      inputs: isSet(object.inputs) ? globalThis.String(object.inputs) : "",
      parents: globalThis.Array.isArray(object?.parents) ? object.parents.map((e: any) => globalThis.String(e)) : [],
      userData: isSet(object.userData) ? globalThis.String(object.userData) : "",
      retries: isSet(object.retries) ? globalThis.Number(object.retries) : 0,
    };
  },

  toJSON(message: CreateWorkflowStepOpts): unknown {
    const obj: any = {};
    if (message.readableId !== "") {
      obj.readableId = message.readableId;
    }
    if (message.action !== "") {
      obj.action = message.action;
    }
    if (message.timeout !== "") {
      obj.timeout = message.timeout;
    }
    if (message.inputs !== "") {
      obj.inputs = message.inputs;
    }
    if (message.parents?.length) {
      obj.parents = message.parents;
    }
    if (message.userData !== "") {
      obj.userData = message.userData;
    }
    if (message.retries !== 0) {
      obj.retries = Math.round(message.retries);
    }
    return obj;
  },

  create(base?: DeepPartial<CreateWorkflowStepOpts>): CreateWorkflowStepOpts {
    return CreateWorkflowStepOpts.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<CreateWorkflowStepOpts>): CreateWorkflowStepOpts {
    const message = createBaseCreateWorkflowStepOpts();
    message.readableId = object.readableId ?? "";
    message.action = object.action ?? "";
    message.timeout = object.timeout ?? "";
    message.inputs = object.inputs ?? "";
    message.parents = object.parents?.map((e) => e) || [];
    message.userData = object.userData ?? "";
    message.retries = object.retries ?? 0;
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
  return { name: "", schedules: [], input: "" };
}

export const ScheduleWorkflowRequest = {
  encode(message: ScheduleWorkflowRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    for (const v of message.schedules) {
      Timestamp.encode(toTimestamp(v!), writer.uint32(18).fork()).ldelim();
    }
    if (message.input !== "") {
      writer.uint32(26).string(message.input);
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
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      schedules: globalThis.Array.isArray(object?.schedules)
        ? object.schedules.map((e: any) => fromJsonTimestamp(e))
        : [],
      input: isSet(object.input) ? globalThis.String(object.input) : "",
    };
  },

  toJSON(message: ScheduleWorkflowRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.schedules?.length) {
      obj.schedules = message.schedules.map((e) => e.toISOString());
    }
    if (message.input !== "") {
      obj.input = message.input;
    }
    return obj;
  },

  create(base?: DeepPartial<ScheduleWorkflowRequest>): ScheduleWorkflowRequest {
    return ScheduleWorkflowRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ScheduleWorkflowRequest>): ScheduleWorkflowRequest {
    const message = createBaseScheduleWorkflowRequest();
    message.name = object.name ?? "";
    message.schedules = object.schedules?.map((e) => e) || [];
    message.input = object.input ?? "";
    return message;
  },
};

function createBaseWorkflowVersion(): WorkflowVersion {
  return { id: "", createdAt: undefined, updatedAt: undefined, version: "", order: 0, workflowId: "" };
}

export const WorkflowVersion = {
  encode(message: WorkflowVersion, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(18).fork()).ldelim();
    }
    if (message.updatedAt !== undefined) {
      Timestamp.encode(toTimestamp(message.updatedAt), writer.uint32(26).fork()).ldelim();
    }
    if (message.version !== "") {
      writer.uint32(42).string(message.version);
    }
    if (message.order !== 0) {
      writer.uint32(48).int32(message.order);
    }
    if (message.workflowId !== "") {
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
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      createdAt: isSet(object.createdAt) ? fromJsonTimestamp(object.createdAt) : undefined,
      updatedAt: isSet(object.updatedAt) ? fromJsonTimestamp(object.updatedAt) : undefined,
      version: isSet(object.version) ? globalThis.String(object.version) : "",
      order: isSet(object.order) ? globalThis.Number(object.order) : 0,
      workflowId: isSet(object.workflowId) ? globalThis.String(object.workflowId) : "",
    };
  },

  toJSON(message: WorkflowVersion): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.createdAt !== undefined) {
      obj.createdAt = message.createdAt.toISOString();
    }
    if (message.updatedAt !== undefined) {
      obj.updatedAt = message.updatedAt.toISOString();
    }
    if (message.version !== "") {
      obj.version = message.version;
    }
    if (message.order !== 0) {
      obj.order = Math.round(message.order);
    }
    if (message.workflowId !== "") {
      obj.workflowId = message.workflowId;
    }
    return obj;
  },

  create(base?: DeepPartial<WorkflowVersion>): WorkflowVersion {
    return WorkflowVersion.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<WorkflowVersion>): WorkflowVersion {
    const message = createBaseWorkflowVersion();
    message.id = object.id ?? "";
    message.createdAt = object.createdAt ?? undefined;
    message.updatedAt = object.updatedAt ?? undefined;
    message.version = object.version ?? "";
    message.order = object.order ?? 0;
    message.workflowId = object.workflowId ?? "";
    return message;
  },
};

function createBaseWorkflowTriggerEventRef(): WorkflowTriggerEventRef {
  return { parentId: "", eventKey: "" };
}

export const WorkflowTriggerEventRef = {
  encode(message: WorkflowTriggerEventRef, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.parentId !== "") {
      writer.uint32(10).string(message.parentId);
    }
    if (message.eventKey !== "") {
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
      parentId: isSet(object.parentId) ? globalThis.String(object.parentId) : "",
      eventKey: isSet(object.eventKey) ? globalThis.String(object.eventKey) : "",
    };
  },

  toJSON(message: WorkflowTriggerEventRef): unknown {
    const obj: any = {};
    if (message.parentId !== "") {
      obj.parentId = message.parentId;
    }
    if (message.eventKey !== "") {
      obj.eventKey = message.eventKey;
    }
    return obj;
  },

  create(base?: DeepPartial<WorkflowTriggerEventRef>): WorkflowTriggerEventRef {
    return WorkflowTriggerEventRef.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<WorkflowTriggerEventRef>): WorkflowTriggerEventRef {
    const message = createBaseWorkflowTriggerEventRef();
    message.parentId = object.parentId ?? "";
    message.eventKey = object.eventKey ?? "";
    return message;
  },
};

function createBaseWorkflowTriggerCronRef(): WorkflowTriggerCronRef {
  return { parentId: "", cron: "" };
}

export const WorkflowTriggerCronRef = {
  encode(message: WorkflowTriggerCronRef, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.parentId !== "") {
      writer.uint32(10).string(message.parentId);
    }
    if (message.cron !== "") {
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
      parentId: isSet(object.parentId) ? globalThis.String(object.parentId) : "",
      cron: isSet(object.cron) ? globalThis.String(object.cron) : "",
    };
  },

  toJSON(message: WorkflowTriggerCronRef): unknown {
    const obj: any = {};
    if (message.parentId !== "") {
      obj.parentId = message.parentId;
    }
    if (message.cron !== "") {
      obj.cron = message.cron;
    }
    return obj;
  },

  create(base?: DeepPartial<WorkflowTriggerCronRef>): WorkflowTriggerCronRef {
    return WorkflowTriggerCronRef.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<WorkflowTriggerCronRef>): WorkflowTriggerCronRef {
    const message = createBaseWorkflowTriggerCronRef();
    message.parentId = object.parentId ?? "";
    message.cron = object.cron ?? "";
    return message;
  },
};

function createBaseTriggerWorkflowRequest(): TriggerWorkflowRequest {
  return { name: "", input: "" };
}

export const TriggerWorkflowRequest = {
  encode(message: TriggerWorkflowRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.name !== "") {
      writer.uint32(10).string(message.name);
    }
    if (message.input !== "") {
      writer.uint32(18).string(message.input);
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
      name: isSet(object.name) ? globalThis.String(object.name) : "",
      input: isSet(object.input) ? globalThis.String(object.input) : "",
    };
  },

  toJSON(message: TriggerWorkflowRequest): unknown {
    const obj: any = {};
    if (message.name !== "") {
      obj.name = message.name;
    }
    if (message.input !== "") {
      obj.input = message.input;
    }
    return obj;
  },

  create(base?: DeepPartial<TriggerWorkflowRequest>): TriggerWorkflowRequest {
    return TriggerWorkflowRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<TriggerWorkflowRequest>): TriggerWorkflowRequest {
    const message = createBaseTriggerWorkflowRequest();
    message.name = object.name ?? "";
    message.input = object.input ?? "";
    return message;
  },
};

function createBaseTriggerWorkflowResponse(): TriggerWorkflowResponse {
  return { workflowRunId: "" };
}

export const TriggerWorkflowResponse = {
  encode(message: TriggerWorkflowResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.workflowRunId !== "") {
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
    return { workflowRunId: isSet(object.workflowRunId) ? globalThis.String(object.workflowRunId) : "" };
  },

  toJSON(message: TriggerWorkflowResponse): unknown {
    const obj: any = {};
    if (message.workflowRunId !== "") {
      obj.workflowRunId = message.workflowRunId;
    }
    return obj;
  },

  create(base?: DeepPartial<TriggerWorkflowResponse>): TriggerWorkflowResponse {
    return TriggerWorkflowResponse.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<TriggerWorkflowResponse>): TriggerWorkflowResponse {
    const message = createBaseTriggerWorkflowResponse();
    message.workflowRunId = object.workflowRunId ?? "";
    return message;
  },
};

/** WorkflowService represents a set of RPCs for managing workflows. */
export type WorkflowServiceDefinition = typeof WorkflowServiceDefinition;
export const WorkflowServiceDefinition = {
  name: "WorkflowService",
  fullName: "WorkflowService",
  methods: {
    putWorkflow: {
      name: "PutWorkflow",
      requestType: PutWorkflowRequest,
      requestStream: false,
      responseType: WorkflowVersion,
      responseStream: false,
      options: {},
    },
    scheduleWorkflow: {
      name: "ScheduleWorkflow",
      requestType: ScheduleWorkflowRequest,
      requestStream: false,
      responseType: WorkflowVersion,
      responseStream: false,
      options: {},
    },
    triggerWorkflow: {
      name: "TriggerWorkflow",
      requestType: TriggerWorkflowRequest,
      requestStream: false,
      responseType: TriggerWorkflowResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface WorkflowServiceImplementation<CallContextExt = {}> {
  putWorkflow(
    request: PutWorkflowRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<WorkflowVersion>>;
  scheduleWorkflow(
    request: ScheduleWorkflowRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<WorkflowVersion>>;
  triggerWorkflow(
    request: TriggerWorkflowRequest,
    context: CallContext & CallContextExt,
  ): Promise<DeepPartial<TriggerWorkflowResponse>>;
}

export interface WorkflowServiceClient<CallOptionsExt = {}> {
  putWorkflow(
    request: DeepPartial<PutWorkflowRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<WorkflowVersion>;
  scheduleWorkflow(
    request: DeepPartial<ScheduleWorkflowRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<WorkflowVersion>;
  triggerWorkflow(
    request: DeepPartial<TriggerWorkflowRequest>,
    options?: CallOptions & CallOptionsExt,
  ): Promise<TriggerWorkflowResponse>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
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
  } else if (typeof o === "string") {
    return new globalThis.Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
