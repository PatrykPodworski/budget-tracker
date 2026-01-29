import { useFormContext, useWatch } from "react-hook-form";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { PriceTotal } from "./price-total";
import { ReceiptFormData } from "@/lib/receipt-data/receipt-form-schema";

// TODO: P2 Reuse input group with zł addon from total-price.tsx
export const PriceInputs = ({ id, index }: PriceInputsProps) => {
  const { register, control } = useFormContext<ReceiptFormData>();
  const item = useWatch({ control, name: `items.${index}` });

  return (
    <div className="p-2 pt-1 flex gap-2 rounded-b-md bg-accent">
      <div>
        <Label htmlFor={`${id}-quantity`} className="text-xs">
          Quantity
        </Label>
        <Input
          type="number"
          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
          className="no-input-arrows"
        />
      </div>
      <div>
        <Label htmlFor={`${id}-unitPrice`} className="text-xs">
          Unit price
        </Label>
        <Input
          type="number"
          {...register(`items.${index}.unitPrice`, { valueAsNumber: true })}
          className="no-input-arrows"
        />
      </div>
      <div>
        <Label htmlFor={`${id}-discount`} className="text-xs">
          Discount
        </Label>
        <Input
          type="number"
          {...register(`items.${index}.discount`, { valueAsNumber: true })}
          className="no-input-arrows"
        />
      </div>
      <div className="hidden sm:block">
        <Label htmlFor={`${id}-total`} className="text-xs">
          Total
        </Label>
        <PriceTotal item={item} />
      </div>
    </div>
  );
};

type PriceInputsProps = {
  id: string;
  index: number;
};
