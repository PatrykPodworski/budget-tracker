import { useFormContext, Controller } from "react-hook-form";
import { CategorySelect } from "@/components/category-select";
import { Input } from "@/components/ui/shadcn/input";
import { Label } from "@/components/ui/shadcn/label";
import { PriceCollapse } from "./price-collapse";
import { Button } from "@/components/ui/shadcn/button";
import { TrashIcon } from "lucide-react";
import { ReceiptFormData } from "@/lib/receipt-data/receipt-form-schema";

export const ReceiptItem = ({ index, onItemDelete }: ReceiptItemProps) => {
  const { register, control } = useFormContext<ReceiptFormData>();
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
          {...register(`items.${index}.name`)}
        />
        <Button variant="outline" onClick={onItemDelete}>
          <TrashIcon className="h-4 w-4 text-destructive" />
          <span className="hidden sm:inline">Delete</span>
        </Button>
      </div>
      <Label htmlFor={`${idPrefix}-category`} className="self-center">
        Category
      </Label>
      <Controller
        name={`items.${index}.category`}
        control={control}
        render={({ field }) => (
          <CategorySelect
            id={`${idPrefix}-category`}
            onValueChange={field.onChange}
            value={field.value}
          />
        )}
      />
      <Label htmlFor={`${idPrefix}-price`} className="mt-[11px]">
        Price
      </Label>
      <PriceCollapse index={index} id={`${idPrefix}-price`} />
    </div>
  );
};

type ReceiptItemProps = {
  index: number;
  onItemDelete: () => void;
};
