import { z } from "zod";

const processingBundleReceiptSchema = z.union([
  z.object({
    id: z.string(),
    status: z.enum(["uploading", "reading", "processing", "done"]),
  }),
  z.object({
    id: z.string(),
    status: z.literal("error"),
    error: z.string(),
  }),
]);

export const processingBundleSchema = z.object({
  id: z.string(),
  receipts: z.array(processingBundleReceiptSchema),
});

export type ProcessingBundle = z.infer<typeof processingBundleSchema>;
