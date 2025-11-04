import { LoadingButton } from "@/components/ui/loading-button";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export const AddReceiptItem = ({ onAddItem }: AddReceiptItemProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddItem = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      await onAddItem();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoadingButton
      variant="outline"
      onClick={handleAddItem}
      className="ml-[80px]"
      loading={isLoading}
    >
      <PlusIcon className="h-4 w-4 mr-2" />
      Add Item
    </LoadingButton>
  );
};

type AddReceiptItemProps = {
  onAddItem: () => Promise<void>;
};
