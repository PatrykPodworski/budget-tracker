import { EnrichedItem } from "@/models/enriched-item-schema";
import { Input } from "@/components/ui/shadcn/input";
import { Collapse } from "@/components/ui/collapse";
import { Label } from "@/components/ui/shadcn/label";
import React from "react";

// TODO: P1 One change handler for all inputs
// TODO: P3 XS Label variant
export const PriceCollapse = ({
  item,
  id,
  isLoading,
  handleQuantityChange,
  handleUnitPriceChange,
  handleDiscountChange,
}: PriceCollapseProps) => {
  const calculatedTotalPrice =
    Math.round(item.quantity * item.unitPrice * 100 - item.discount * 100) /
    100;

  return (
    <Collapse
      title={`${item.quantity} x ${item.unitPrice} zł - ${item.discount} zł = ${calculatedTotalPrice} zł`}
      id={`${id}`}
    >
      <div className="p-2 pt-1 flex gap-2 rounded-b-md bg-accent">
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
      </div>
    </Collapse>
  );
};

type PriceCollapseProps = {
  id: string;
  isLoading: boolean;
  item: Pick<EnrichedItem, "quantity" | "unitPrice" | "discount">;
  handleQuantityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleUnitPriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDiscountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
