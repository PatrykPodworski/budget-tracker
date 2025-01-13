"use server";
import { PatchOperation } from "@azure/cosmos";
import { EnrichedItem } from "@/models/enriched-item-schema";
import { enrichedReceiptDataSchema } from "@/models/enriched-receipt-data-schema";
import { getReceiptContainer } from "@/lib/receipt-data/common/get-receipt-container";

export const updateReceiptItem = async (
  id: string,
  partitionKey: string,
  newItem: EnrichedItem,
  order: number
) => {
  const container = getReceiptContainer();

  const operations: PatchOperation[] = [
    { op: "replace", path: `/items/${order}`, value: newItem },
  ];

  const { resource } = await container
    .item(id, partitionKey)
    .patch({ operations });

  const parsed = enrichedReceiptDataSchema.parse(resource);
  return parsed;
};
