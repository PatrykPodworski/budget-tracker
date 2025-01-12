"use client";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { ReceiptItem } from "./receipt-item";
import { formatDate } from "@/lib/utils";

export const Receipt = ({ receipt, onReceiptChange }: ReceiptProps) => {
  const handleItemChange = (
    index: number,
    item: EnrichedReceiptData["items"][number]
  ) => {
    const newItems = [...receipt.items];
    newItems[index] = item;
    const newReceipt = { ...receipt, items: newItems };
    onReceiptChange(newReceipt);
  };

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
            onItemChange={(newItem) => handleItemChange(index, newItem)}
          />
        ))}
      </div>
    </div>
  );
};

type ReceiptProps = {
  receipt: EnrichedReceiptData;
  onReceiptChange: (receipt: EnrichedReceiptData) => void;
};
