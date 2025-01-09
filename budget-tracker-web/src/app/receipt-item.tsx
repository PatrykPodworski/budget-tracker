import { EnrichedItem } from "@/models/enriched-item-schema";

export const ReceiptItem = ({ item }: ReceiptItemProps) => {
  return (
    <p className="flex gap-2">
      <span>{item.name}</span>
      <span>{item.category}</span>
      <span>{item.totalPrice} zł</span>
    </p>
  );
};

type ReceiptItemProps = {
  item: EnrichedItem;
};
