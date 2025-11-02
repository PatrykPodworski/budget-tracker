import { z } from "zod";
import { PROCESSING_STATUS_ERROR, PROCESSING_STEPS } from "./processing-steps";

// TODO: P1 Unify the types in web and function projects
const processingBundleReceiptSchema = z.union([
  z.object({
    status: z.enum(PROCESSING_STEPS),
  }),
  z.object({
    status: z.literal(PROCESSING_STATUS_ERROR),
    error: z.string(),
  }),
]);

export const processingBundleSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  receipts: z.record(z.string().uuid(), processingBundleReceiptSchema),
});

export type ProcessingBundle = z.infer<typeof processingBundleSchema>;
