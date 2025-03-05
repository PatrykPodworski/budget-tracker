import { z } from "zod";

// TODO: P1 Unify the types in web and function projects
const processingBundleReceiptSchema = z.union([
  z.object({
    status: z.enum(["uploaded", "read", "enriched"]),
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
