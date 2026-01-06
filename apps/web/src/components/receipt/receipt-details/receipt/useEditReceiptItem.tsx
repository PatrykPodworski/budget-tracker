import {
  EnrichedItem,
  enrichedItemSchema,
} from "@budget-tracker/shared/enriched-item-schema";

export const useEditReceiptItem = (
  item: EnrichedItem,
  onItemChange: (item: EnrichedItem) => void
) => {
  const handleCategoryChange = (value: string) => {
    const newItem = { ...item, category: value };
    onItemChange(newItem);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    const newItem = { ...item, name: newName };

    const isValidItem = enrichedItemSchema.safeParse(newItem);
    if (!isValidItem.success) {
      return;
    }

    onItemChange(newItem);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseFloat(event.target.value);
    const newItem = { ...item, quantity: newQuantity };

    const isValidItem = enrichedItemSchema.safeParse(newItem);
    if (!isValidItem.success) {
      return;
    }

    onItemChange(newItem);
  };

  const handleUnitPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newUnitPrice = parseFloat(event.target.value);
    const newItem = { ...item, unitPrice: newUnitPrice };

    const isValidItem = enrichedItemSchema.safeParse(newItem);
    if (!isValidItem.success) {
      return;
    }

    onItemChange(newItem);
  };

  const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDiscount = parseFloat(event.target.value);
    const newItem = { ...item, discount: newDiscount };

    const isValidItem = enrichedItemSchema.safeParse(newItem);
    if (!isValidItem.success) {
      return;
    }

    onItemChange(newItem);
  };

  return {
    handleCategoryChange,
    handleNameChange,
    handleQuantityChange,
    handleUnitPriceChange,
    handleDiscountChange,
  };
};
