"use client";
import { useState } from "react";
import { Receipt } from "@/components/receipt/receipt-details/receipt";
import { EnrichedReceiptData } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { ReceiptFormData } from "@/lib/receipt-data/update";
import { Person } from "@/data/people";
import equal from "fast-deep-equal";

export const ReceiptDetails = ({
  receipt: initialReceipt,
  people,
}: ReceiptDetailsProps) => {
  const [formData, setFormData] = useState<ReceiptFormData>(() =>
    getFormDataFromReceipt(initialReceipt)
  );

  const originalData = getFormDataFromReceipt(initialReceipt);
  const hasChanges = !areEqual(formData, originalData);

  const handleFormChange = (updateData: Partial<ReceiptFormData>) => {
    setFormData((prev) => ({ ...prev, ...updateData }));
  };

  return (
    <Receipt
      receipt={{ ...initialReceipt, ...formData }}
      people={people}
      hasChanges={hasChanges}
      onFormChange={handleFormChange}
    />
  );
};

type ReceiptDetailsProps = {
  receipt: EnrichedReceiptData;
  people: readonly Person[];
};

const getFormDataFromReceipt = (
  receipt: EnrichedReceiptData
): ReceiptFormData => ({
  merchantName: receipt.merchantName,
  transactionDate: receipt.transactionDate,
  total: receipt.total,
  items: receipt.items,
  paidBy: receipt.paidBy,
});

const areEqual = (a: ReceiptFormData, b: ReceiptFormData): boolean => {
  const normalizedA = {
    ...a,
    transactionDate: a.transactionDate?.getTime(),
  };
  const normalizedB = {
    ...b,
    transactionDate: b.transactionDate?.getTime(),
  };

  return equal(normalizedA, normalizedB);
};
