import { z } from "zod";

// TODO: P0 include items because content might be out of order
export const receiptRawDataSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  content: z.string().min(1),
  imageFileName: z.string().min(1),
});

export type ReceiptRawData = z.infer<typeof receiptRawDataSchema>;
