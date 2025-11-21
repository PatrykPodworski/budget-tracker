"use server";
import { PatchOperation } from "@azure/cosmos";
import { EnrichedItem } from "@budget-tracker/shared/enriched-item-schema";
import {
  enrichedReceiptDataSchema,
  PaymentParticipant,
} from "@budget-tracker/shared/enriched-receipt-data-schema";
import { getReceiptContainer } from "@/lib/receipt-data/common/get-receipt-container";

export const updateReceiptItem = async (
  id: string,
  partitionKey: string,
  newItem: EnrichedItem,
  order: number
) => updateReceiptField(id, partitionKey, `items/${order}`, newItem);

export const updateReceiptMerchantName = async (
  id: string,
  partitionKey: string,
  newMerchantName: string
) => updateReceiptField(id, partitionKey, "merchantName", newMerchantName);

export const updateReceiptTransactionDate = async (
  id: string,
  partitionKey: string,
  newTransactionDate: Date | undefined
) =>
  updateReceiptField(id, partitionKey, "transactionDate", newTransactionDate);

export const updateReceiptPaidBy = async (
  id: string,
  partitionKey: string,
  paidBy: PaymentParticipant[]
) => updateReceiptField(id, partitionKey, "paidBy", paidBy);

export const markReceiptAsSent = async (id: string, partitionKey: string) =>
  updateReceiptField(id, partitionKey, "isSentToBudget", true);

const updateReceiptField = async (
  id: string,
  partitionKey: string,
  field: string,
  value: unknown
) => {
  const container = getReceiptContainer();

  const operations: PatchOperation[] = [
    { op: "replace", path: `/${field}`, value },
  ];

  const { resource } = await container
    .item(id, partitionKey)
    .patch({ operations });

  const parsed = enrichedReceiptDataSchema.parse(resource);
  return parsed;
};
