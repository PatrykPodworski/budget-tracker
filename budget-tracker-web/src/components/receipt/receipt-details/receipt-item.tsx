import { EnrichedItem } from "@/models/enriched-item-schema";
import { CategorySelect } from "@/components/category-select";
import { Input } from "@/components/ui/shadcn/input";
import { useDebounce } from "@/lib/utils/use-debounce";

// TODO: P1 validate item after change
export const ReceiptItem = ({ item, onItemChange }: ReceiptItemProps) => {
  const { isLoading, debounced } = useDebounce(onItemChange);

  const handleCategoryChange = (value: string) => {
    const newItem = { ...item, category: value };
    debounced(newItem);
    debounced.flush();
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newName = event.target.value;
    const newItem = { ...item, name: newName };
    debounced(newItem);
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseFloat(event.target.value);
    const newItem = { ...item, quantity: newQuantity };
    debounced(newItem);
  };

  const handleUnitPriceChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newUnitPrice = parseFloat(event.target.value);
    const newItem = { ...item, unitPrice: newUnitPrice };
    debounced(newItem);
  };

  const handleDiscountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDiscount = parseFloat(event.target.value);
    console.log(newDiscount);
    const newItem = { ...item, discount: newDiscount };
    debounced(newItem);
  };

  return (
    <div className="flex gap-2 items-baseline">
      <Input
        type="text"
        defaultValue={item.name}
        onChange={handleNameChange}
        className="max-w-80"
        disabled={isLoading}
      />
      <CategorySelect
        onValueChange={handleCategoryChange}
        value={item.category}
        disabled={isLoading}
      />
      <Input
        type="number"
        defaultValue={item.quantity}
        onChange={handleQuantityChange}
        className="max-w-16 no-input-arrows"
        disabled={isLoading}
      />
      <span>*</span>
      <Input
        type="number"
        defaultValue={item.unitPrice}
        onChange={handleUnitPriceChange}
        className="max-w-20 no-input-arrows"
        disabled={isLoading}
      />
      <span>zł - </span>
      <Input
        type="number"
        defaultValue={item.discount}
        onChange={handleDiscountChange}
        className="max-w-16 no-input-arrows"
        disabled={isLoading}
      />
      <span>zł = {item.totalPrice} zł</span>
    </div>
  );
};

type ReceiptItemProps = {
  item: EnrichedItem;
  onItemChange: (item: EnrichedItem) => void;
};
