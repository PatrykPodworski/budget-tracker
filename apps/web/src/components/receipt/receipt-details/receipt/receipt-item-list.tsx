import { useFieldArray, useFormContext } from "react-hook-form";
import { categories } from "@/data/categories";
import { EnrichedItem } from "@budget-tracker/shared/enriched-item-schema";
import { AddReceiptItem } from "./add-receipt-item";
import { ReceiptItem } from "./receipt-item";
import { ReceiptFormData } from "@/lib/receipt-data/receipt-form-schema";

export const ReceiptItemList = () => {
  const { control } = useFormContext<ReceiptFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const handleAddItem = () => {
    const newItem: EnrichedItem = {
      name: "New Item",
      originalName: "New Item",
      category: categories[0],
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      totalPrice: 0,
    };
    append(newItem);
  };

  return (
    <div className="flex flex-col gap-8 sm:gap-4">
      {fields.map((field, index) => (
        <ReceiptItem
          key={field.id}
          index={index}
          onItemDelete={() => remove(index)}
        />
      ))}
      <AddReceiptItem onAddItem={handleAddItem} />
    </div>
  );
};
