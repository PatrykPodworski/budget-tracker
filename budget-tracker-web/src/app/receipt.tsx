"use client";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { ReceiptItem } from "./receipt-item";

export const Receipt = ({ receipt }: ReceiptProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div>
          <strong>Merchant:</strong> {receipt.merchantName}
        </div>
        <div>
          <strong>Date:</strong> {receipt.transactionDate?.toLocaleDateString()}{" "}
          {receipt.transactionDate?.toLocaleTimeString()}
        </div>
        <div>
          <strong>Amount:</strong> {receipt.total} zł
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {receipt.items.map((item, index) => (
          <ReceiptItem key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

type ReceiptProps = {
  receipt: EnrichedReceiptData;
};
