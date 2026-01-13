import { categories } from "@/data/categories";
import { EnrichedItem } from "@budget-tracker/shared/enriched-item-schema";
import { AddReceiptItem } from "./add-receipt-item";
import { ReceiptItem } from "./receipt-item";

export const ReceiptItemList = ({
  items,
  onItemsChange,
}: ReceiptItemListProps) => {
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
    onItemsChange([...items, newItem]);
  };

  const handleItemChange = (newItem: EnrichedItem, index: number) => {
    onItemsChange(items.map((x, i) => (i === index ? newItem : x)));
  };

  const handleItemDelete = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-8 sm:gap-4">
      {items.map((item, index) => (
        <ReceiptItem
          key={`${index}_${item.originalName}`}
          index={index}
          item={item}
          onItemChange={(item) => handleItemChange(item, index)}
          onItemDelete={() => handleItemDelete(index)}
        />
      ))}
      <AddReceiptItem onAddItem={handleAddItem} />
    </div>
  );
};

type ReceiptItemListProps = {
  items: EnrichedItem[];
  onItemsChange: (items: EnrichedItem[]) => void;
};
