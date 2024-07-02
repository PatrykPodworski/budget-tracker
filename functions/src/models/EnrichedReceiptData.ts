import { ReceiptRawData } from "./ReceiptRawData";
import { ResponseItem } from "../functions/DataEnricher/enrichDocumentWithAssistant";
import { z } from "zod";

export const enrichedReceiptDataSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  rawDocumentId: z.string().uuid(),
  total: z.number(),
  merchantName: z.string().optional(),
  transactionDate: z.string().pipe(z.coerce.date()).optional(),
  items: z.array(
    z.object({
      name: z.string().min(1),
      originalName: z.string().min(1),
      category: z.string().min(1),
      totalPrice: z.number(),
      unitPrice: z.number(),
      quantity: z.number().positive(),
    })
  ),
});

export const mapToEnrichedReceiptData = (
  response: ResponseItem[],
  source: ReceiptRawData
): EnrichedReceiptData => {
  const responseMap = response.reduce((acc, item) => {
    acc.set(item.originalName, item);
    return acc;
  }, new Map<string, ResponseItem>());

  const combined = source.items.map((item) => {
    let responseItem = responseMap.get(item.name);
    if (!responseItem) {
      responseItem = {
        category: "Unknown",
        name: "Unknown",
        originalName: item.name,
      };
    }

    return {
      ...item,
      ...responseItem,
    };
  });

  return {
    id: crypto.randomUUID(),
    userId: source.userId,
    rawDocumentId: source.id,
    total: source.total,
    items: combined,
    merchantName: source.merchantName,
    transactionDate: source.transactionDate,
  };
};

export type EnrichedReceiptData = z.infer<typeof enrichedReceiptDataSchema>;
export type Item = EnrichedReceiptData["items"][number];
