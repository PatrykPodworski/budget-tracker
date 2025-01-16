"use client";
import { useState } from "react";
import { ExcelOutput } from "@/components/receipt/receipt-details/excel-output";
import { Receipt } from "@/components/receipt/receipt-details/receipt";
import { EnrichedItem } from "@/models/enriched-item-schema";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import {
  updateReceiptItem,
  updateReceiptMerchantName,
  updateReceiptTransactionDate,
} from "@/lib/receipt-data/update";

// TODO: P0 Update item name
// TODO: P0 Prettier product quantity and price
// TODO: P1 Add loading state
// TODO: P2 Error handling on update
// TODO: P3 Input with end icon
export const ReceiptDetails = ({
  receipt: initialReceiptData,
}: ReceiptDetailsProps) => {
  const [receipt, setReceipt] = useState(initialReceiptData);

  const handleReceiptItemChange = async (
    newItem: EnrichedItem,
    index: number
  ) => {
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
