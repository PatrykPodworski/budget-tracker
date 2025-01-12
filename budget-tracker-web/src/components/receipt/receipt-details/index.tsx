"use client";
import { ExcelOutput } from "@/components/receipt/receipt-details/excel-output";
import { Receipt } from "@/components/receipt/receipt-details/receipt";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { useState } from "react";

export const ReceiptDetails = ({
  receipt: initialReceiptData,
}: ReceiptDetailsProps) => {
  const [receipt, setReceipt] = useState(initialReceiptData);
  const handleReceiptChange = (newReceipt: EnrichedReceiptData) => {
    setReceipt(newReceipt);
  };

  return (
    <div>
      <Receipt receipt={receipt} onReceiptChange={handleReceiptChange} />
      <ExcelOutput items={receipt.items} />
    </div>
  );
};

type ReceiptDetailsProps = {
  receipt: EnrichedReceiptData;
};
