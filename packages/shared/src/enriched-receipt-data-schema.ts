import { z } from "zod";
import { enrichedItemSchema } from "./enriched-item-schema";

export const enrichedReceiptDataSchema = z.object({
  id: z.uuid(),
  processingStatusId: z.uuid(),
  userId: z.uuid(),
  total: z.number(),
  merchantName: z.string().optional(),
  transactionDate: z.string().pipe(z.coerce.date()).optional(),
  items: z.array(enrichedItemSchema),
  isSentToBudget: z.boolean(),
});

export type EnrichedReceiptData = z.infer<typeof enrichedReceiptDataSchema>;
