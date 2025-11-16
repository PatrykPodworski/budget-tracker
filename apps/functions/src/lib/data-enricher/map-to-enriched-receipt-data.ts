import { EnrichedReceiptData } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { ReceiptRawData } from "@budget-tracker/shared/receipt-raw-data";
import { AssistantResponse } from "./assistant-response";

export const mapToEnrichedReceiptData = (
  response: AssistantResponse,
  source: ReceiptRawData
): EnrichedReceiptData => {
  const enriched = {
    id: source.id,
    processingStatusId: source.processingStatusId,
    userId: source.userId,
    total: response.total,
    merchantName: response.merchantName,
    transactionDate: response.transactionDate,
    items: response.items,
    isSentToBudget: false,
  };

  return enriched;
};
