"use client";
import { Label } from "@/components/ui/shadcn/label";
import { formatCurrency } from "@/lib/utils";
import { EnrichedItem } from "@/models/enriched-item-schema";

export const TotalPrice = ({ total, items }: TotalPriceProps) => {
  const calculatedTotal = calculateTotal(items);

  const totalDifference = total - calculatedTotal;
  console.log(total, calculatedTotal, totalDifference);

  return (
    <div>
      <div className="flex gap-2 items-baseline">
        <Label htmlFor="total">Total</Label>
        <span id="total" className="text-base">
          {formatCurrency(total)}
        </span>
      </div>
      <div className="flex gap-2 items-baseline">
        <Label htmlFor="calculatedTotal">Calculated Total</Label>
        <span id="calculatedTotal" className="text-base">
          {formatCurrency(calculatedTotal)}
        </span>
        {totalDifference !== 0 && (
          <>
            <Label htmlFor="totalDifference">Difference</Label>
            <span id="totalDifference" className="text-base text-destructive">
              {formatCurrency(totalDifference)}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

const calculateTotal = (items: EnrichedItem[]) => {
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

type TotalPriceProps = {
  total: number;
  items: EnrichedItem[];
};
