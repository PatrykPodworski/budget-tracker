"use client";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { formatCurrency } from "@/lib/utils";
import { useDebounce } from "@/lib/utils/use-debounce";
import { useState, useEffect } from "react";
import { EnrichedItem } from "@budget-tracker/shared/enriched-item-schema";
import { calculateTotal } from "./calculate-total";

export const TotalPrice = ({
  total,
  items,
  onTotalChange,
}: TotalPriceProps) => {
  const [localTotal, setLocalTotal] = useState(total.toString());
  const { debounced } = useDebounce(onTotalChange);

  const calculatedTotal = calculateTotal(items);
  const totalDifference = total - calculatedTotal;

  useEffect(() => {
    setLocalTotal(total.toString());
  }, [total]);

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow numbers with up to 2 decimal places
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setLocalTotal(value);
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        debounced(numericValue);
      }
    }
  };

  return (
    <div>
      <div className="flex gap-2 items-baseline mb-2">
        <Label htmlFor="total">Total</Label>
        <Input
          id="total"
          type="text"
          inputMode="decimal"
          value={localTotal}
          onChange={handleTotalChange}
          className="w-32 h-8"
        />
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

type TotalPriceProps = {
  total: number;
  items: EnrichedItem[];
  onTotalChange: (newTotal: number) => Promise<void>;
};
