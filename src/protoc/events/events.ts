// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.178.0
//   protoc               v3.19.1
// source: events/events.proto

/* eslint-disable */
import { type CallContext, type CallOptions } from 'nice-grpc-common';
import * as _m0 from 'protobufjs/minimal';
import { Timestamp } from '../google/protobuf/timestamp';

export const protobufPackage = '';

export interface Event {
  /** the tenant id */
  tenantId: string;
  /** the id of the event */
  eventId: string;
  /** the key for the event */
  key: string;
  /** the payload for the event */
  payload: string;
  /** when the event was generated */
  eventTimestamp: Date | undefined;
  /** the payload for the event */
  additionalMetadata?: string | undefined;
}

export interface PutLogRequest {
  /** the step run id for the request */
  stepRunId: string;
  /** when the log line was created */
  createdAt: Date | undefined;
  /** the log line message */
  message: string;
  /** the log line level */
  level?: string | undefined;
  /** associated log line metadata */
  metadata: string;
}

export interface PutLogResponse {}

export interface PutStreamEventRequest {
  /** the step run id for the request */
  stepRunId: string;
  /** when the stream event was created */
  createdAt: Date | undefined;
  /** the stream event message */
  message: Uint8Array;
  /** associated stream event metadata */
  metadata: string;
}

export interface PutStreamEventResponse {}

export interface PushEventRequest {
  /** the key for the event */
  key: string;
  /** the payload for the event */
  payload: string;
  /** when the event was generated */
  eventTimestamp: Date | undefined;
  /** metadata for the event */
  additionalMetadata?: string | undefined;
}

export interface ReplayEventRequest {
  /** the event id to replay */
  eventId: string;
}

function createBaseEvent(): Event {
  return {
    tenantId: '',
    eventId: '',
    key: '',
    payload: '',
    eventTimestamp: undefined,
    additionalMetadata: undefined,
  };
}

export const Event = {
  encode(message: Event, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tenantId !== '') {
      writer.uint32(10).string(message.tenantId);
    }
    if (message.eventId !== '') {
      writer.uint32(18).string(message.eventId);
    }
    if (message.key !== '') {
      writer.uint32(26).string(message.key);
    }
    if (message.payload !== '') {
      writer.uint32(34).string(message.payload);
    }
    if (message.eventTimestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.eventTimestamp), writer.uint32(42).fork()).ldelim();
    }
    if (message.additionalMetadata !== undefined) {
      writer.uint32(50).string(message.additionalMetadata);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Event {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.tenantId = reader.string();
          continue;
        case 2:
          if (tag !== 18) {
            break;
          }

          message.eventId = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.key = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.payload = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.eventTimestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 6:
          if (tag !== 50) {
            break;
          }

          message.additionalMetadata = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): Event {
    return {
      tenantId: isSet(object.tenantId) ? globalThis.String(object.tenantId) : '',
      eventId: isSet(object.eventId) ? globalThis.String(object.eventId) : '',
      key: isSet(object.key) ? globalThis.String(object.key) : '',
      payload: isSet(object.payload) ? globalThis.String(object.payload) : '',
      eventTimestamp: isSet(object.eventTimestamp)
        ? fromJsonTimestamp(object.eventTimestamp)
        : undefined,
      additionalMetadata: isSet(object.additionalMetadata)
        ? globalThis.String(object.additionalMetadata)
        : undefined,
    };
  },

  toJSON(message: Event): unknown {
    const obj: any = {};
    if (message.tenantId !== '') {
      obj.tenantId = message.tenantId;
    }
    if (message.eventId !== '') {
      obj.eventId = message.eventId;
    }
    if (message.key !== '') {
      obj.key = message.key;
    }
    if (message.payload !== '') {
      obj.payload = message.payload;
    }
    if (message.eventTimestamp !== undefined) {
      obj.eventTimestamp = message.eventTimestamp.toISOString();
    }
    if (message.additionalMetadata !== undefined) {
      obj.additionalMetadata = message.additionalMetadata;
    }
    return obj;
  },

  create(base?: DeepPartial<Event>): Event {
    return Event.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<Event>): Event {
    const message = createBaseEvent();
    message.tenantId = object.tenantId ?? '';
    message.eventId = object.eventId ?? '';
    message.key = object.key ?? '';
    message.payload = object.payload ?? '';
    message.eventTimestamp = object.eventTimestamp ?? undefined;
    message.additionalMetadata = object.additionalMetadata ?? undefined;
    return message;
  },
};

function createBasePutLogRequest(): PutLogRequest {
  return { stepRunId: '', createdAt: undefined, message: '', level: undefined, metadata: '' };
}

export const PutLogRequest = {
  encode(message: PutLogRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stepRunId !== '') {
      writer.uint32(10).string(message.stepRunId);
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(18).fork()).ldelim();
    }
    if (message.message !== '') {
      writer.uint32(26).string(message.message);
    }
    if (message.level !== undefined) {
      writer.uint32(34).string(message.level);
    }
    if (message.metadata !== '') {
      writer.uint32(42).string(message.metadata);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PutLogRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePutLogRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.stepRunId = reader.string();
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

          message.message = reader.string();
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.level = reader.string();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.metadata = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PutLogRequest {
    return {
      stepRunId: isSet(object.stepRunId) ? globalThis.String(object.stepRunId) : '',
      createdAt: isSet(object.createdAt) ? fromJsonTimestamp(object.createdAt) : undefined,
      message: isSet(object.message) ? globalThis.String(object.message) : '',
      level: isSet(object.level) ? globalThis.String(object.level) : undefined,
      metadata: isSet(object.metadata) ? globalThis.String(object.metadata) : '',
    };
  },

  toJSON(message: PutLogRequest): unknown {
    const obj: any = {};
    if (message.stepRunId !== '') {
      obj.stepRunId = message.stepRunId;
    }
    if (message.createdAt !== undefined) {
      obj.createdAt = message.createdAt.toISOString();
    }
    if (message.message !== '') {
      obj.message = message.message;
    }
    if (message.level !== undefined) {
      obj.level = message.level;
    }
    if (message.metadata !== '') {
      obj.metadata = message.metadata;
    }
    return obj;
  },

  create(base?: DeepPartial<PutLogRequest>): PutLogRequest {
    return PutLogRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<PutLogRequest>): PutLogRequest {
    const message = createBasePutLogRequest();
    message.stepRunId = object.stepRunId ?? '';
    message.createdAt = object.createdAt ?? undefined;
    message.message = object.message ?? '';
    message.level = object.level ?? undefined;
    message.metadata = object.metadata ?? '';
    return message;
  },
};

function createBasePutLogResponse(): PutLogResponse {
  return {};
}

export const PutLogResponse = {
  encode(_: PutLogResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PutLogResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePutLogResponse();
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

  fromJSON(_: any): PutLogResponse {
    return {};
  },

  toJSON(_: PutLogResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<PutLogResponse>): PutLogResponse {
    return PutLogResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<PutLogResponse>): PutLogResponse {
    const message = createBasePutLogResponse();
    return message;
  },
};

function createBasePutStreamEventRequest(): PutStreamEventRequest {
  return { stepRunId: '', createdAt: undefined, message: new Uint8Array(0), metadata: '' };
}

export const PutStreamEventRequest = {
  encode(message: PutStreamEventRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.stepRunId !== '') {
      writer.uint32(10).string(message.stepRunId);
    }
    if (message.createdAt !== undefined) {
      Timestamp.encode(toTimestamp(message.createdAt), writer.uint32(18).fork()).ldelim();
    }
    if (message.message.length !== 0) {
      writer.uint32(26).bytes(message.message);
    }
    if (message.metadata !== '') {
      writer.uint32(42).string(message.metadata);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PutStreamEventRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePutStreamEventRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.stepRunId = reader.string();
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

          message.message = reader.bytes();
          continue;
        case 5:
          if (tag !== 42) {
            break;
          }

          message.metadata = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PutStreamEventRequest {
    return {
      stepRunId: isSet(object.stepRunId) ? globalThis.String(object.stepRunId) : '',
      createdAt: isSet(object.createdAt) ? fromJsonTimestamp(object.createdAt) : undefined,
      message: isSet(object.message) ? bytesFromBase64(object.message) : new Uint8Array(0),
      metadata: isSet(object.metadata) ? globalThis.String(object.metadata) : '',
    };
  },

  toJSON(message: PutStreamEventRequest): unknown {
    const obj: any = {};
    if (message.stepRunId !== '') {
      obj.stepRunId = message.stepRunId;
    }
    if (message.createdAt !== undefined) {
      obj.createdAt = message.createdAt.toISOString();
    }
    if (message.message.length !== 0) {
      obj.message = base64FromBytes(message.message);
    }
    if (message.metadata !== '') {
      obj.metadata = message.metadata;
    }
    return obj;
  },

  create(base?: DeepPartial<PutStreamEventRequest>): PutStreamEventRequest {
    return PutStreamEventRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<PutStreamEventRequest>): PutStreamEventRequest {
    const message = createBasePutStreamEventRequest();
    message.stepRunId = object.stepRunId ?? '';
    message.createdAt = object.createdAt ?? undefined;
    message.message = object.message ?? new Uint8Array(0);
    message.metadata = object.metadata ?? '';
    return message;
  },
};

function createBasePutStreamEventResponse(): PutStreamEventResponse {
  return {};
}

export const PutStreamEventResponse = {
  encode(_: PutStreamEventResponse, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PutStreamEventResponse {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePutStreamEventResponse();
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

  fromJSON(_: any): PutStreamEventResponse {
    return {};
  },

  toJSON(_: PutStreamEventResponse): unknown {
    const obj: any = {};
    return obj;
  },

  create(base?: DeepPartial<PutStreamEventResponse>): PutStreamEventResponse {
    return PutStreamEventResponse.fromPartial(base ?? {});
  },
  fromPartial(_: DeepPartial<PutStreamEventResponse>): PutStreamEventResponse {
    const message = createBasePutStreamEventResponse();
    return message;
  },
};

function createBasePushEventRequest(): PushEventRequest {
  return { key: '', payload: '', eventTimestamp: undefined, additionalMetadata: undefined };
}

export const PushEventRequest = {
  encode(message: PushEventRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== '') {
      writer.uint32(10).string(message.key);
    }
    if (message.payload !== '') {
      writer.uint32(18).string(message.payload);
    }
    if (message.eventTimestamp !== undefined) {
      Timestamp.encode(toTimestamp(message.eventTimestamp), writer.uint32(26).fork()).ldelim();
    }
    if (message.additionalMetadata !== undefined) {
      writer.uint32(34).string(message.additionalMetadata);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): PushEventRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBasePushEventRequest();
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

          message.payload = reader.string();
          continue;
        case 3:
          if (tag !== 26) {
            break;
          }

          message.eventTimestamp = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          continue;
        case 4:
          if (tag !== 34) {
            break;
          }

          message.additionalMetadata = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): PushEventRequest {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : '',
      payload: isSet(object.payload) ? globalThis.String(object.payload) : '',
      eventTimestamp: isSet(object.eventTimestamp)
        ? fromJsonTimestamp(object.eventTimestamp)
        : undefined,
      additionalMetadata: isSet(object.additionalMetadata)
        ? globalThis.String(object.additionalMetadata)
        : undefined,
    };
  },

  toJSON(message: PushEventRequest): unknown {
    const obj: any = {};
    if (message.key !== '') {
      obj.key = message.key;
    }
    if (message.payload !== '') {
      obj.payload = message.payload;
    }
    if (message.eventTimestamp !== undefined) {
      obj.eventTimestamp = message.eventTimestamp.toISOString();
    }
    if (message.additionalMetadata !== undefined) {
      obj.additionalMetadata = message.additionalMetadata;
    }
    return obj;
  },

  create(base?: DeepPartial<PushEventRequest>): PushEventRequest {
    return PushEventRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<PushEventRequest>): PushEventRequest {
    const message = createBasePushEventRequest();
    message.key = object.key ?? '';
    message.payload = object.payload ?? '';
    message.eventTimestamp = object.eventTimestamp ?? undefined;
    message.additionalMetadata = object.additionalMetadata ?? undefined;
    return message;
  },
};

function createBaseReplayEventRequest(): ReplayEventRequest {
  return { eventId: '' };
}

export const ReplayEventRequest = {
  encode(message: ReplayEventRequest, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.eventId !== '') {
      writer.uint32(10).string(message.eventId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ReplayEventRequest {
    const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseReplayEventRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          if (tag !== 10) {
            break;
          }

          message.eventId = reader.string();
          continue;
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skipType(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): ReplayEventRequest {
    return { eventId: isSet(object.eventId) ? globalThis.String(object.eventId) : '' };
  },

  toJSON(message: ReplayEventRequest): unknown {
    const obj: any = {};
    if (message.eventId !== '') {
      obj.eventId = message.eventId;
    }
    return obj;
  },

  create(base?: DeepPartial<ReplayEventRequest>): ReplayEventRequest {
    return ReplayEventRequest.fromPartial(base ?? {});
  },
  fromPartial(object: DeepPartial<ReplayEventRequest>): ReplayEventRequest {
    const message = createBaseReplayEventRequest();
    message.eventId = object.eventId ?? '';
    return message;
  },
};

export type EventsServiceDefinition = typeof EventsServiceDefinition;
export const EventsServiceDefinition = {
  name: 'EventsService',
  fullName: 'EventsService',
  methods: {
    push: {
      name: 'Push',
      requestType: PushEventRequest,
      requestStream: false,
      responseType: Event,
      responseStream: false,
      options: {},
    },
    replaySingleEvent: {
      name: 'ReplaySingleEvent',
      requestType: ReplayEventRequest,
      requestStream: false,
      responseType: Event,
      responseStream: false,
      options: {},
    },
    putLog: {
      name: 'PutLog',
      requestType: PutLogRequest,
      requestStream: false,
      responseType: PutLogResponse,
      responseStream: false,
      options: {},
    },
    putStreamEvent: {
      name: 'PutStreamEvent',
      requestType: PutStreamEventRequest,
      requestStream: false,
      responseType: PutStreamEventResponse,
      responseStream: false,
      options: {},
    },
  },
} as const;

export interface EventsServiceImplementation<CallContextExt = {}> {
  push(
    request: PushEventRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<Event>>;
  replaySingleEvent(
    request: ReplayEventRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<Event>>;
  putLog(
    request: PutLogRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<PutLogResponse>>;
  putStreamEvent(
    request: PutStreamEventRequest,
    context: CallContext & CallContextExt
  ): Promise<DeepPartial<PutStreamEventResponse>>;
}

export interface EventsServiceClient<CallOptionsExt = {}> {
  push(
    request: DeepPartial<PushEventRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<Event>;
  replaySingleEvent(
    request: DeepPartial<ReplayEventRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<Event>;
  putLog(
    request: DeepPartial<PutLogRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<PutLogResponse>;
  putStreamEvent(
    request: DeepPartial<PutStreamEventRequest>,
    options?: CallOptions & CallOptionsExt
  ): Promise<PutStreamEventResponse>;
}

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, 'base64'));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString('base64');
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(''));
  }
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

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
