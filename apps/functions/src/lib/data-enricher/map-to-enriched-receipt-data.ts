import {
  enrichedReceiptDataSchema,
  EnrichedReceiptData,
} from "@budget-tracker/shared/enriched-receipt-data-schema";
import { ReceiptRawData } from "@budget-tracker/shared/receipt-raw-data";
import { AssistantResponse } from "./assistant-response";
import { config } from "../../config";
import { normalizeTransactionDate } from "./normalize-transaction-date";

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
    transactionDate: response.transactionDate
      ? normalizeTransactionDate(response.transactionDate)
      : response.transactionDate,
    items: response.items,
    isSentToBudget: false,
    paidBy: config.DEFAULT_PAID_BY,
  };

  // Validate the enriched data before saving to Cosmos DB
  return enrichedReceiptDataSchema.parse(enriched);
};
