import {
  CreateManagedWorkerRuntimeConfigRequest,
  ManagedWorkerRegion,
} from '@hatchet/clients/rest/generated/cloud/data-contracts';
import { createHash } from 'crypto';
import { z } from 'zod';

const BaseComputeSchema = z.object({
  pool: z.string().default('default').optional().describe('The name of the compute pool to use'),
  numReplicas: z
    .number()
    .int()
    .min(0, { message: 'Must be at least 0' })
    .max(1000, { message: 'Must be at most 1000' })
    .default(1)
    .describe('The number of replicas'),
  regions: z
    .array(z.nativeEnum(ManagedWorkerRegion))
    .optional()
    .describe('The regions to deploy the worker to'),
  cpus: z
    .number()
    .int()
    .min(1, { message: 'Must be at least 1' })
    .max(64, { message: 'Must be at most 64' })
    .describe('The number of CPUs to use for the worker'),
});

export const SharedCPUComputeSchema = BaseComputeSchema.extend({
  cpuKind: z.literal('shared'),
  memoryMb: z
    .number()
    .int()
    .min(256, { message: 'Must be at least 256 MB' })
    .max(65536, { message: 'Must be at most 65536 MB' })
    .refine((val) => val % 256 === 0, { message: 'Must be divisible by 256 MB' })
    .describe('The amount of memory in MB to use for the worker'),
});

export type SharedCPUCompute = z.infer<typeof SharedCPUComputeSchema>;

export const PerformanceCPUComputeSchema = BaseComputeSchema.extend({
  cpuKind: z.literal('performance'),
  memoryMb: z
    .number()
    .int()
    .min(2048, { message: 'Must be at least 1024 MB' })
    .max(65536, { message: 'Must be at most 65536 MB' })
    .refine((val) => val % 256 === 0, { message: 'Must be divisible by 256 MB' })
    .describe('The amount of memory in MB to use for the worker'),
});

export type PerformanceCPUCompute = z.infer<typeof PerformanceCPUComputeSchema>;

type GPUKind = CreateManagedWorkerRuntimeConfigRequest['gpuKind'];

// eslint-disable-next-line no-shadow
const AllowedGPUManagedWorkerRegions = [ManagedWorkerRegion.Ord];

export const GPUComputeSchema = BaseComputeSchema.extend({
  cpuKind: z.literal('shared'),
  gpuKind: z.enum(['a10', 'l40s', 'a100-40gb', 'a100-80gb'] as const satisfies GPUKind[]),
  regions: z
    .array(z.nativeEnum(ManagedWorkerRegion))
    .refine((val) => val.every((region) => AllowedGPUManagedWorkerRegions.includes(region)), {
      message: 'Invalid GPU region',
    })
    .optional()
    .describe('The regions to deploy the worker to'),
  memoryMb: z
    .number()
    .int()
    .min(2048, { message: 'Must be at least 1024 MB' })
    .max(65536, { message: 'Must be at most 65536 MB' })
    .refine((val) => val % 256 === 0, { message: 'Must be divisible by 256 MB' })
    .describe('The amount of memory in MB to use for the worker'),
});

export type GPUCompute = z.infer<typeof GPUComputeSchema>;

export const ComputeSchema = z.union([
  SharedCPUComputeSchema,
  PerformanceCPUComputeSchema,
  GPUComputeSchema,
]);

export const computeHash = (compute: z.infer<typeof ComputeSchema>) => {
  const str = JSON.stringify(compute);
  return createHash('sha256').update(str).digest('hex');
};
