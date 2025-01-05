import { ReceiptRawData } from "./ReceiptRawData";
import { z } from "zod";
import { AssistantResponse } from "../functions/DataEnricher/AssistantResponse";

// TODO: P1 Unify ids (image, raw, enriched)
// TODO: P1 Move the files

export const enrichedItemSchema = z.object({
  originalName: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  unitPrice: z.number().nonnegative(),
  quantity: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  discount: z.number().nonnegative(),
});

export const enrichedReceiptDataSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  rawDocumentId: z.string().uuid(),
  total: z.number(),
  merchantName: z.string().optional(),
  transactionDate: z.string().pipe(z.coerce.date()).optional(),
  items: z.array(enrichedItemSchema),
});

export const mapToEnrichedReceiptData = (
  response: AssistantResponse,
  source: ReceiptRawData
) => {
  const enriched: EnrichedReceiptData = {
    id: source.id,
    userId: source.userId,
    rawDocumentId: source.id,
    total: response.total,
    merchantName: response.merchantName,
    transactionDate: response.transactionDate,
    items: response.items,
  };

  return enriched;
};

export type EnrichedReceiptData = z.infer<typeof enrichedReceiptDataSchema>;
export type EnrichedItem = z.infer<typeof enrichedItemSchema>;
