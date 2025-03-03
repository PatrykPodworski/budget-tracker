import { z } from "zod";
import { AssistantResponse } from "../lib/data-enricher/assistant-response";
import { enrichedItemSchema } from "./enriched-item-schema";
import { ReceiptRawData } from "./receipt-raw-data";

export const enrichedReceiptDataSchema = z.object({
  id: z.string().uuid(),
  processingStatusId: z.string().uuid(),
  userId: z.string().uuid(),
  rawDocumentId: z.string().uuid(),
  total: z.number(),
  merchantName: z.string().optional(),
  transactionDate: z.string().pipe(z.coerce.date()).optional(),
  items: z.array(enrichedItemSchema),
});

export type EnrichedReceiptData = z.infer<typeof enrichedReceiptDataSchema>;

export const mapToEnrichedReceiptData = (
  response: AssistantResponse,
  source: ReceiptRawData
): EnrichedReceiptData => {
  const enriched = {
    id: source.id,
    processingStatusId: source.processingStatusId,
    userId: source.userId,
    rawDocumentId: source.id,
    total: response.total,
    merchantName: response.merchantName,
    transactionDate: response.transactionDate,
    items: response.items,
  };

  return enriched;
};
