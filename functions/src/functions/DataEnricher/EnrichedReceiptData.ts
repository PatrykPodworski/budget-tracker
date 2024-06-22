import { Document } from "./documentSchema";
import { ResponseItem } from "./enrichDocumentWithAssistant";

export const mapToEnrichedReceiptData = (
  response: ResponseItem[],
  source: Document
): EnrichedReceiptData => {
  const responseMap = response.reduce((acc, item) => {
    acc.set(item.originalName, item);
    return acc;
  }, new Map<string, ResponseItem>());

  const combined = source.items.map((item) => {
    const responseItem = responseMap.get(item.name);
    if (!responseItem) {
      throw new Error(`Response item not found for ${item.name}`);
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
  };
};

export type EnrichedReceiptData = {
  id: string;
  rawDocumentId: string;
  userId: string;
  items: CombinedItem[];
  total: number;
};

type CombinedItem = Document["items"][number] & ResponseItem;
