"use server";
import { categories } from "@/data/categories";
import { EnrichedItem } from "@budget-tracker/shared/enriched-item-schema";
import { enrichedReceiptDataSchema } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { PatchOperation } from "@azure/cosmos";
import { getReceiptContainer } from "./common/get-receipt-container";

/**
 * Adds a new default item to the end of the receipt's items array
 * @param id The receipt id
 * @param partitionKey userId
 * @returns The updated receipt data
 */

export const addReceiptItem = async (id: string, partitionKey: string) => {
  const container = getReceiptContainer();

  // Create a new default item
  const newItem: EnrichedItem = {
    name: "New Item",
    originalName: "New Item",
    category: categories[0],
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    totalPrice: 0,
  };

  // Use the JSON Patch "-" syntax to append to the array
  const operations: PatchOperation[] = [
    { op: "add", path: "/items/-", value: newItem },
  ];

  const { resource } = await container
    .item(id, partitionKey)
    .patch({ operations });

  const parsed = enrichedReceiptDataSchema.parse(resource);
  return parsed;
};
