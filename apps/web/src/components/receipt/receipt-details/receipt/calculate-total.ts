import { EnrichedItem } from "@budget-tracker/shared/enriched-item-schema";

export const calculateTotal = (items: EnrichedItem[]) => {
  const totalInCents = items.reduce((acc, item) => {
    const itemTotal = getItemTotal(item);
    return acc + itemTotal;
  }, 0);

  return totalInCents / 100;
};

const getItemTotal = (item: EnrichedItem) => {
  const unitPrice = item.unitPrice * 100;
  const quantity = item.quantity * 1000;
  const discount = item.discount * 100;
  return Math.round((unitPrice * quantity) / 1000 - discount);
};

