"use client";
import { useState } from "react";
import { Receipt } from "@/components/receipt/receipt-details/receipt";
import {
  EnrichedItem,
  enrichedItemSchema,
} from "@/models/enriched-item-schema";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import {
  updateReceiptItem,
  updateReceiptMerchantName,
  updateReceiptTransactionDate,
} from "@/lib/receipt-data/update";
import { addReceiptItem } from "@/lib/receipt-data/add-receipt-item";
import { deleteReceiptItem } from "@/lib/receipt-data/delete-receipt-item";

// TODO: P1 Zustand store; move handlers down
// TODO: P2 Input with end icon
// TODO: P3 Error handling on update
export const ReceiptDetails = ({
  receipt: initialReceiptData,
}: ReceiptDetailsProps) => {
  const [receipt, setReceipt] = useState(initialReceiptData);

  const handleReceiptItemChange = async (
    newItem: EnrichedItem,
    index: number
  ) => {
    const isValidItem = enrichedItemSchema.safeParse(newItem);
    if (!isValidItem.success) {
      return;
    }

    const updatedReceipt = await updateReceiptItem(
      receipt.id,
      receipt.userId,
      newItem,
      index
    );

    setReceipt(updatedReceipt);
  };

  const handleMerchantChange = async (newMerchantName: string) => {
    const updatedReceipt = await updateReceiptMerchantName(
      receipt.id,
      receipt.userId,
      newMerchantName
    );

    setReceipt(updatedReceipt);
  };

  const handleDateChange = async (newDate: Date | undefined) => {
    const updatedReceipt = await updateReceiptTransactionDate(
      receipt.id,
      receipt.userId,
      newDate
    );

    setReceipt(updatedReceipt);
  };

  const handleAddItem = async () => {
    const updatedReceipt = await addReceiptItem(receipt.id, receipt.userId);

    setReceipt(updatedReceipt);
  };

  const handleItemDelete = async (index: number) => {
    const updatedReceipt = await deleteReceiptItem(
      receipt.id,
      receipt.userId,
      index
    );

    setReceipt(updatedReceipt);
  };

  return (
    <Receipt
      receipt={receipt}
      onReceiptItemChange={handleReceiptItemChange}
      onMerchantChange={handleMerchantChange}
      onDateChange={handleDateChange}
      onAddItem={handleAddItem}
      onItemDelete={handleItemDelete}
    />
  );
};

type ReceiptDetailsProps = {
  receipt: EnrichedReceiptData;
};
