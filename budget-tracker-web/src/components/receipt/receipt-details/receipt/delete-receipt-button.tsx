"use client";
import { Button } from "@/components/ui/shadcn/button";
import { deleteReceiptData } from "@/lib/receipt-data/delete-receipt-data";
import { useRouter } from "next/navigation";

// TODO: P1 Add confirm dialog before deleting
// TODO: P1 Revalidate list of receipts after deleting
export const DeleteReceiptButton = ({ id }: DeleteReceiptButton) => {
  const router = useRouter();
  const handleDelete = async () => {
    await deleteReceiptData(id);
    router.push("/");
  };

  return (
    <Button className="sm:mt-6" variant="destructive" onClick={handleDelete}>
      Delete
    </Button>
  );
};

type DeleteReceiptButton = {
  id: string;
};
