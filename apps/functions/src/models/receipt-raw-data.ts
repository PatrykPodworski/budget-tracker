import { z } from "zod";

export const receiptRawDataSchema = z.object({
  id: z.string().uuid(),
  processingStatusId: z.string().uuid(),
  userId: z.string().uuid(),
  content: z.string().min(1),
  imageFileName: z.string().min(1),
});

export type ReceiptRawData = z.infer<typeof receiptRawDataSchema>;
