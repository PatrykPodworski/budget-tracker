"use client";
import { Label } from "@/components/ui/shadcn/label";
import { formatCurrency } from "@/lib/utils";

// TODO: P0 Move calculating here; use total from receipt elsewhere; allow to edit total
export const TotalPrice = ({ total, calculatedTotal }: TotalPriceProps) => {
  const totalDifference = total - calculatedTotal;

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

type TotalPriceProps = {
  total: number;
  calculatedTotal: number;
};
