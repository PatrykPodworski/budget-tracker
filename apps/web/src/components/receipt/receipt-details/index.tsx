"use client";
import { useState } from "react";
import { Receipt } from "@/components/receipt/receipt-details/receipt";
import {
  EnrichedItem,
  enrichedItemSchema,
} from "@budget-tracker/shared/enriched-item-schema";
import {
  EnrichedReceiptData,
  PaymentParticipant,
} from "@budget-tracker/shared/enriched-receipt-data-schema";
import {
  updateReceiptItem,
  updateReceiptMerchantName,
  updateReceiptTransactionDate,
  updateReceiptPaidBy,
  updateReceiptTotal,
} from "@/lib/receipt-data/update";
import { addReceiptItem } from "@/lib/receipt-data/add-receipt-item";
import { deleteReceiptItem } from "@/lib/receipt-data/delete-receipt-item";
import { Person } from "@/data/people";

// TODO: P1 Zustand store; move handlers down
// TODO: P2 Input with end icon
// TODO: P3 Error handling on update
export const ReceiptDetails = ({
  receipt: initialReceiptData,
  people,
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

  const handlePaidByChange = async (paidBy: PaymentParticipant[]) => {
    const updatedReceipt = await updateReceiptPaidBy(
      receipt.id,
      receipt.userId,
      paidBy
    );

    setReceipt(updatedReceipt);
  };

  const handleTotalChange = async (newTotal: number) => {
    const updatedReceipt = await updateReceiptTotal(
      receipt.id,
      receipt.userId,
      newTotal
    );

    setReceipt(updatedReceipt);
  };

  return (
    <Receipt
      receipt={receipt}
      people={people}
      onReceiptItemChange={handleReceiptItemChange}
      onMerchantChange={handleMerchantChange}
      onDateChange={handleDateChange}
      onPaidByChange={handlePaidByChange}
      onTotalChange={handleTotalChange}
      onAddItem={handleAddItem}
      onItemDelete={handleItemDelete}
    />
  );
};

type ReceiptDetailsProps = {
  receipt: EnrichedReceiptData;
  people: readonly Person[];
};
