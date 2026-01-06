import { Button } from "@/components/ui/shadcn/button";
import { PlusIcon } from "lucide-react";

export const AddReceiptItem = ({ onAddItem }: AddReceiptItemProps) => {
  return (
    <Button
      variant="outline"
      onClick={onAddItem}
      className="ml-[80px]"
    >
      <PlusIcon className="h-4 w-4 mr-2" />
      Add Item
    </Button>
  );
};

type AddReceiptItemProps = {
  onAddItem: () => void;
};
