"use client";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { ReceiptItem } from "./receipt-item";
import { formatDate } from "@/lib/utils";
import { EnrichedItem } from "@/models/enriched-item-schema";

export const Receipt = ({ receipt, onReceiptItemChange }: ReceiptProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div>
          <strong>Merchant:</strong>&nbsp;{receipt.merchantName}
        </div>
        <div>
          <strong>Date:&nbsp;</strong>
          {formatDate(receipt.transactionDate)}
        </div>
        <div>
          <strong>Amount:</strong>&nbsp;{receipt.total} zł
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {receipt.items.map((item, index) => (
          <ReceiptItem
            key={index}
            item={item}
            onItemChange={(newItem) => onReceiptItemChange(newItem, index)}
          />
        ))}
      </div>
    </div>
  );
};

type ReceiptProps = {
  receipt: EnrichedReceiptData;
  onReceiptItemChange: (newItem: EnrichedItem, index: number) => Promise<void>;
};
