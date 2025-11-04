import { z } from "zod";
import { PROCESSING_STATUS_ERROR, PROCESSING_STEPS } from "./processing-steps";

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
  id: z.uuid(),
  userId: z.uuid(),
  receipts: z.record(z.uuid(), processingBundleReceiptSchema),
});

export type ProcessingBundle = z.infer<typeof processingBundleSchema>;
