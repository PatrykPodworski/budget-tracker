import { z } from "zod";

export const receiptRawDataSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  total: z.number(),
  items: z.array(
    z.object({
      name: z.string().min(1),
      quantity: z.number().positive(),
      unitPrice: z.number(),
      totalPrice: z.number(),
    })
  ),
});

export type ReceiptRawData = z.infer<typeof receiptRawDataSchema>;
export type RawItem = ReceiptRawData["items"][number];
