import { EnrichedItem } from "@/models/enriched-item-schema";
import { CategorySelect } from "@/components/category-select";
import { Input } from "@/components/ui/shadcn/input";
import { useEditReceiptItem } from "./useEditReceiptItem";
import { Label } from "@/components/ui/shadcn/label";
import React from "react";
import { PriceCollapse } from "./price-collapse";
import { Button } from "@/components/ui/shadcn/button";
import { TrashIcon } from "lucide-react";

// TODO: P2 Implement generic handler
export const ReceiptItem = ({
  item,
  onItemChange,
  onItemDelete,
  index,
}: ReceiptItemProps) => {
  const {
    handleCategoryChange,
    handleNameChange,
    handleQuantityChange,
    handleUnitPriceChange,
    handleDiscountChange,
    handleDelete,
    isLoading,
  } = useEditReceiptItem(item, onItemChange, onItemDelete);
  const idPrefix = `item-${index}`;

  return (
    <div className="grid grid-cols-[64px,auto] gap-x-4 gap-y-2 auto-cols-auto">
      <Label htmlFor={`${idPrefix}-name`} className="self-center">
        Name
      </Label>
      <div className="flex gap-2 items-center">
        <Input
          id={`${idPrefix}-name`}
          type="text"
          defaultValue={item.name}
          onChange={handleNameChange}
          disabled={isLoading}
        />
        <Button variant="outline" onClick={handleDelete} disabled={isLoading}>
          <TrashIcon className="h-4 w-4 text-destructive" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
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
  onItemChange: (item: EnrichedItem) => Promise<void>;
  onItemDelete: () => Promise<void>;
};
