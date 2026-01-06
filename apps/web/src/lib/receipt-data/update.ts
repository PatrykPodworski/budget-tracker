"use server";
import { PatchOperation } from "@azure/cosmos";
import { EnrichedItem } from "@budget-tracker/shared/enriched-item-schema";
import {
  enrichedReceiptDataSchema,
  PaymentParticipant,
} from "@budget-tracker/shared/enriched-receipt-data-schema";
import { getReceiptContainer } from "@/lib/receipt-data/common/get-receipt-container";

export type ReceiptFormData = {
  merchantName?: string;
  transactionDate?: Date;
  total: number;
  items: EnrichedItem[];
  paidBy: PaymentParticipant[];
};

export const saveReceipt = async (
  id: string,
  partitionKey: string,
  data: ReceiptFormData
) => {
  const container = getReceiptContainer();

  const operations: PatchOperation[] = [
    { op: "replace", path: "/merchantName", value: data.merchantName },
    { op: "replace", path: "/transactionDate", value: data.transactionDate },
    { op: "replace", path: "/total", value: data.total },
    { op: "replace", path: "/items", value: data.items },
    { op: "replace", path: "/paidBy", value: data.paidBy },
  ];

  const { resource } = await container
    .item(id, partitionKey)
    .patch({ operations });

  const parsed = enrichedReceiptDataSchema.parse(resource);
  return parsed;
};

export const markReceiptAsSent = async (id: string, partitionKey: string) => {
  const container = getReceiptContainer();

  const operations: PatchOperation[] = [
    { op: "replace", path: "/isSentToBudget", value: true },
  ];

  const { resource } = await container
    .item(id, partitionKey)
    .patch({ operations });

  const parsed = enrichedReceiptDataSchema.parse(resource);
  return parsed;
};
