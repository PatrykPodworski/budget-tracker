import { z } from "zod";

export const PROCESSING_FINISHED_STATUS = "enriched";

// TODO: P1 Unify the types in web and function projects
const processingBundleReceiptSchema = z.union([
  z.object({
    status: z.enum(["uploaded", "read", PROCESSING_FINISHED_STATUS]),
  }),
  z.object({
    status: z.literal("error"),
    error: z.string(),
  }),
]);

export const processingBundleSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  receipts: z.record(z.string().uuid(), processingBundleReceiptSchema),
});

export type ProcessingBundle = z.infer<typeof processingBundleSchema>;
