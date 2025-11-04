"use server";
import { enrichedReceiptDataSchema } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { PatchOperation } from "@azure/cosmos";
import { getReceiptContainer } from "./common/get-receipt-container";

/**
 * Deletes an item from the receipt's items array at the specified index
 * @param id The receipt id
 * @param partitionKey userId
 * @param index The index of the item to delete
 * @returns The updated receipt data
 */
export const deleteReceiptItem = async (
  id: string,
  partitionKey: string,
  index: number
) => {
  const container = getReceiptContainer();

  // Use the JSON Patch "remove" operation with the index in the path
  const operations: PatchOperation[] = [
    { op: "remove", path: `/items/${index}` },
  ];

  const { resource } = await container
    .item(id, partitionKey)
    .patch({ operations });

  const parsed = enrichedReceiptDataSchema.parse(resource);
  return parsed;
};
