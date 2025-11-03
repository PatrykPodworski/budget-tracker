import { z } from "zod";
import { enrichedItemSchema } from "./enriched-item-schema";

export const enrichedReceiptDataSchema = z.object({
  id: z.string().uuid(),
  processingStatusId: z.string().uuid(),
  userId: z.string().uuid(),
  rawDocumentId: z.string().uuid(),
  total: z.number(),
  merchantName: z.string().optional(),
  transactionDate: z.string().pipe(z.coerce.date()).optional(),
  items: z.array(enrichedItemSchema),
  isSentToBudget: z.boolean(),
});

export type EnrichedReceiptData = z.infer<typeof enrichedReceiptDataSchema>;
