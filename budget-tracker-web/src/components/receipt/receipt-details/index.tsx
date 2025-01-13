"use client";
import { useState } from "react";
import { ExcelOutput } from "@/components/receipt/receipt-details/excel-output";
import { Receipt } from "@/components/receipt/receipt-details/receipt";
import { EnrichedItem } from "@/models/enriched-item-schema";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { updateReceiptItem } from "@/lib/receipt-data/update-receipt-item";

// TODO: P1 Add loading state
// TODO: P1 Update item name
// TODO: P2 Error handling on update
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

  return (
    <div>
      <Receipt
        receipt={receipt}
        onReceiptItemChange={handleReceiptItemChange}
      />
      <ExcelOutput items={receipt.items} />
    </div>
  );
};

type ReceiptDetailsProps = {
  receipt: EnrichedReceiptData;
};
