"use client";
import { LoadingButton } from "@/components/ui/loading-button";
import { deleteReceiptData } from "@/lib/receipt-data/delete-receipt-data";
import { useRouter } from "next/navigation";
import { useState } from "react";

// TODO: P1 Add confirm dialog before deleting
// TODO: P1 Revalidate list of receipts after deleting
export const DeleteReceiptButton = ({ id }: DeleteReceiptButton) => {
  const router = useRouter();
  const [isDeleting, startDeleting] = useState(false);
  const handleDelete = async () => {
    startDeleting(true);
    await deleteReceiptData(id);
    router.push("/");
  };

  return (
    <LoadingButton
      className="grow sm:grow-0"
      variant="destructive"
      onClick={handleDelete}
      loading={isDeleting}
    >
      Delete receipt
    </LoadingButton>
  );
};

type DeleteReceiptButton = {
  id: string;
};
