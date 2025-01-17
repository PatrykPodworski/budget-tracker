import {
  EnrichedItem,
  enrichedItemSchema,
} from "@/models/enriched-item-schema";
import { CategorySelect } from "@/components/category-select";
import { Input } from "@/components/ui/shadcn/input";
import { useDebounce } from "@/lib/utils/use-debounce";
import { useEffect, useRef } from "react";

// TODO: P2 Implement generic handler
// TODO: P3 Delete item option
// TODO: P3 Add item option
export const ReceiptItem = ({ item, onItemChange }: ReceiptItemProps) => {
  const { isLoading, debounced } = useDebounce(onItemChange);
  const ref = useRef<HTMLInputElement>(undefined);

  useEffect(() => {
    if (isLoading || !ref.current) {
      return;
    }

    ref.current.focus();
    ref.current = undefined;
  }, [isLoading]);

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

  const calculatedTotalPrice =
    Math.round(item.quantity * item.unitPrice * 100 - item.discount * 100) /
    100;

  return (
    <div className="flex gap-2 items-baseline">
      <Input
        type="text"
        defaultValue={item.name}
        onChange={handleNameChange}
        className="max-w-80"
        disabled={isLoading}
      />
      <CategorySelect
        onValueChange={handleCategoryChange}
        value={item.category}
        disabled={isLoading}
      />
      <Input
        type="number"
        defaultValue={item.quantity}
        onChange={handleQuantityChange}
        className="max-w-16 no-input-arrows"
        disabled={isLoading}
      />
      <span>x</span>
      <Input
        type="number"
        defaultValue={item.unitPrice}
        onChange={handleUnitPriceChange}
        className="max-w-20 no-input-arrows"
        disabled={isLoading}
      />
      <span>zł - </span>
      <Input
        type="number"
        defaultValue={item.discount}
        onChange={handleDiscountChange}
        className="max-w-16 no-input-arrows"
        disabled={isLoading}
      />
      <span>zł = {calculatedTotalPrice} zł</span>
    </div>
  );
};

type ReceiptItemProps = {
  item: EnrichedItem;
  onItemChange: (item: EnrichedItem) => void;
};
