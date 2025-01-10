import { EnrichedItem } from "@/models/enriched-item-schema";
import { CategorySelect } from "@/components/category-select";
import { Input } from "@/components/ui/shadcn/input";

export const ReceiptItem = ({ item }: ReceiptItemProps) => {
  return (
    <div className="flex gap-2 items-baseline">
      <Input type="text" defaultValue={item.name} className="w-[320px]" />
      <CategorySelect
        onValueChange={(value) => console.log(value)}
        defaultValue={item.category}
      />
      <span>{item.quantity} *</span>
      <span>{item.unitPrice} zł</span>
      {item.discount > 0 && <span> - {item.discount} zł</span>}
      <span> = {item.totalPrice} zł</span>
    </div>
  );
};

type ReceiptItemProps = {
  item: EnrichedItem;
};
