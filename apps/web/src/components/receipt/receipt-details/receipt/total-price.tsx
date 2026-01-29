"use client";
import { useFormContext, useWatch } from "react-hook-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/shadcn/input-group";
import { Label } from "@/components/ui/shadcn/label";
import { formatCurrency } from "@/lib/utils";
import { calculateTotal } from "./calculate-total";
import { ReceiptFormData } from "@/lib/receipt-data/receipt-form-schema";

// TODO: P0 Fix NaN issue when item price is empty
// TODO: P1 Add currency toggle
export const TotalPrice = () => {
  const { control, register } = useFormContext<ReceiptFormData>();

  const items = useWatch({ control, name: "items" });
  const total = useWatch({ control, name: "total" });

  const calculatedTotal = calculateTotal(items);
  const totalDifference = total - calculatedTotal;

  return (
    <div>
      <div className="flex gap-2 items-center mb-2">
        <Label htmlFor="total">Total</Label>
        <InputGroup className="w-24 h-8">
          <InputGroupInput
            id="total"
            type="number"
            {...register("total", { valueAsNumber: true })}
            className="h-8 no-input-arrows"
          />
          <InputGroupAddon align="inline-end">zł</InputGroupAddon>
        </InputGroup>
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
