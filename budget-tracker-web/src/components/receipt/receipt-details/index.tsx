"use client";
import { useState } from "react";
import { ExcelOutput } from "@/components/receipt/receipt-details/excel-output";
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

// TODO: P0 Prettier product quantity and price
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

  return (
    <>
      <Receipt
        receipt={receipt}
        onReceiptItemChange={handleReceiptItemChange}
        onMerchantChange={handleMerchantChange}
        onDateChange={handleDateChange}
      />
      <ExcelOutput items={receipt.items} />
    </>
  );
};

type ReceiptDetailsProps = {
  receipt: EnrichedReceiptData;
};
