import { z } from "zod";

export const receiptRawDataSchema = z.object({
  id: z.uuid(),
  processingStatusId: z.uuid(),
  userId: z.uuid(),
  content: z.string().min(1),
  imageFileName: z.string().min(1),
});

export type ReceiptRawData = z.infer<typeof receiptRawDataSchema>;
