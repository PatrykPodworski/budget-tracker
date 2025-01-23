import { EnrichedItem } from "@/models/enriched-item-schema";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import React from "react";
import clsx from "clsx";
import { useBreakpoint } from "@/lib/utils/use-breakpoint";
import { PriceTotal } from "./price-total";

export const PriceInputs = ({
  id,
  item,
  handleDiscountChange,
  handleQuantityChange,
  handleUnitPriceChange,
  isLoading,
  className,
}: PriceInputsProps) => {
  const isSm = useBreakpoint("sm");

  return (
    <div className={clsx("p-2 pt-1 flex gap-2 rounded-b-md", className)}>
      <div>
        <Label htmlFor={`${id}-quantity`} className="text-xs">
          Quantity
        </Label>
        <Input
          type="number"
          defaultValue={item.quantity}
          onChange={handleQuantityChange}
          className=" no-input-arrows"
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor={`${id}-quantity`} className="text-xs">
          Unit price
        </Label>
        <Input
          type="number"
          defaultValue={item.unitPrice}
          onChange={handleUnitPriceChange}
          className=" no-input-arrows"
          disabled={isLoading}
        />
      </div>
      <div>
        <Label htmlFor={`${id}-quantity`} className="text-xs">
          Discount
        </Label>
        <Input
          type="number"
          defaultValue={item.discount}
          onChange={handleDiscountChange}
          className="no-input-arrows"
          disabled={isLoading}
        />
      </div>
      {isSm && (
        <div>
          <Label htmlFor={`${id}-total`} className="text-xs">
            Total
          </Label>
          <PriceTotal item={item} />
        </div>
      )}
    </div>
  );
};

export type PriceInputsProps = {
  id: string;
  isLoading: boolean;
  item: Pick<EnrichedItem, "quantity" | "unitPrice" | "discount">;
  handleQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUnitPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDiscountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};
