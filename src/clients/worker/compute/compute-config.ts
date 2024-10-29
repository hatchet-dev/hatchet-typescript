import { ManagedWorkerRegion } from '@hatchet/clients/rest/generated/cloud/data-contracts';
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

export const DedicatedCPUComputeSchema = BaseComputeSchema.extend({
  cpuKind: z.literal('dedicated'),
  memoryMb: z
    .number()
    .int()
    .min(2048, { message: 'Must be at least 1024 MB' })
    .max(65536, { message: 'Must be at most 65536 MB' })
    .refine((val) => val % 256 === 0, { message: 'Must be divisible by 256 MB' })
    .describe('The amount of memory in MB to use for the worker'),
});

export type DedicatedCPUCompute = z.infer<typeof DedicatedCPUComputeSchema>;

export const ComputeSchema = z.union([SharedCPUComputeSchema, DedicatedCPUComputeSchema]);

export const computeHash = (compute: z.infer<typeof ComputeSchema>) => {
  const str = JSON.stringify(compute);
  return createHash('sha256').update(str).digest('hex');
};
