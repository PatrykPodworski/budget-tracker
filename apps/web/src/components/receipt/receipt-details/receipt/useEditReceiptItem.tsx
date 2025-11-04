import { useDebounce } from "@/lib/utils/use-debounce";
import {
  EnrichedItem,
  enrichedItemSchema,
} from "@budget-tracker/shared/enriched-item-schema";
import { useRef, useEffect, useState } from "react";

export const useEditReceiptItem = (
  item: EnrichedItem,
  onItemChange: (item: EnrichedItem) => Promise<void>,
  onItemDelete: () => Promise<void>
) => {
  const { isLoading: isChangeLoading, debounced } = useDebounce(onItemChange);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const ref = useRef<HTMLInputElement>(undefined);

  useEffect(() => {
    if (isChangeLoading || !ref.current) {
      return;
    }

    ref.current.focus();
    ref.current = undefined;
  }, [isChangeLoading]);

  const handleCategoryChange = (value: string) => {
    const newItem = { ...item, category: value };
    debounced(newItem);
    debounced.flush();
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    ref.current = event.target;
    const newName = event.target.value;
    const newItem = { ...item, name: newName };

    const isValidItem = enrichedItemSchema.safeParse(newItem);
    if (!isValidItem.success) {
      return;
    }

    debounced(newItem);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    ref.current = event.target;
    const newQuantity = parseFloat(event.target.value);
    const newItem = { ...item, quantity: newQuantity };

    const isValidItem = enrichedItemSchema.safeParse(newItem);
    if (!isValidItem.success) {
      return;
    }

    debounced(newItem);
  };

  const handleUnitPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    ref.current = event.target;
    const newUnitPrice = parseFloat(event.target.value);
    const newItem = { ...item, unitPrice: newUnitPrice };

    const isValidItem = enrichedItemSchema.safeParse(newItem);
    if (!isValidItem.success) {
      return;
    }

    debounced(newItem);
  };

  const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    ref.current = event.target;
    const newDiscount = parseFloat(event.target.value);
    const newItem = { ...item, discount: newDiscount };

    const isValidItem = enrichedItemSchema.safeParse(newItem);
    if (!isValidItem.success) {
      return;
    }

    debounced(newItem);
  };

  const handleDelete = async () => {
    setIsDeleteLoading(true);
    await onItemDelete();
    setIsDeleteLoading(false);
    ref.current = undefined;
  };

  return {
    handleCategoryChange,
    handleNameChange,
    handleQuantityChange,
    handleUnitPriceChange,
    handleDiscountChange,
    handleDelete,
    isLoading: isDeleteLoading || isChangeLoading,
  };
};
