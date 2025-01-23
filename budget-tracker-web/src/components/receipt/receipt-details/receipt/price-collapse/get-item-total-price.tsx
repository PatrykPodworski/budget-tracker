import { EnrichedItem } from "@/models/enriched-item-schema";

export const getItemTotalPrice = (
  item: Pick<EnrichedItem, "quantity" | "unitPrice" | "discount">
) =>
  Math.round(item.quantity * item.unitPrice * 100 - item.discount * 100) / 100;
