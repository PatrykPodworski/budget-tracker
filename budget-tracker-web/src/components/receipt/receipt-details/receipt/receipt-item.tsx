import { EnrichedItem } from "@/models/enriched-item-schema";
import { CategorySelect } from "@/components/category-select";
import { Input } from "@/components/ui/shadcn/input";
import { useEditReceiptItem } from "./useEditReceiptItem";
import { Label } from "@/components/ui/shadcn/label";
import React from "react";
import { PriceCollapse } from "./price-collapse";

// TODO: P2 Implement generic handler
// TODO: P3 Delete item option
// TODO: P3 Add item option

export const ReceiptItem = ({
  item,
  onItemChange,
  index,
}: ReceiptItemProps) => {
  const {
    handleCategoryChange,
    handleNameChange,
    handleQuantityChange,
    handleUnitPriceChange,
    handleDiscountChange,
    isLoading,
  } = useEditReceiptItem(item, onItemChange);
  const idPrefix = `item-${index}`;

  return (
    <div className="grid grid-cols-[min-content,auto] gap-x-4 gap-y-2 auto-cols-auto">
      <Label htmlFor={`${idPrefix}-name`} className="self-center">
        Name
      </Label>
      <Input
        id={`${idPrefix}-name`}
        type="text"
        defaultValue={item.name}
        onChange={handleNameChange}
        disabled={isLoading}
      />
      <Label htmlFor={`${idPrefix}-category`} className="self-center">
        Category
      </Label>
      <CategorySelect
        id={`${idPrefix}-category`}
        onValueChange={handleCategoryChange}
        value={item.category}
        disabled={isLoading}
      />
      <Label htmlFor={`${idPrefix}-price`} className="mt-[11px]">
        Price
      </Label>
      <PriceCollapse
        item={item}
        id={`${idPrefix}-price`}
        isLoading={isLoading}
        handleQuantityChange={handleQuantityChange}
        handleUnitPriceChange={handleUnitPriceChange}
        handleDiscountChange={handleDiscountChange}
      />
    </div>
  );
};

type ReceiptItemProps = {
  item: EnrichedItem;
  index: number;
  onItemChange: (item: EnrichedItem) => void;
};
