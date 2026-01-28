"use client";
import { useForm, FormProvider, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Receipt } from "@/components/receipt/receipt-details/receipt";
import { EnrichedReceiptData } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { Person } from "@/data/people";
import {
  receiptFormSchema,
  ReceiptFormData,
} from "@/lib/receipt-data/receipt-form-schema";

export const ReceiptDetails = ({
  receipt: initialReceipt,
  people,
}: ReceiptDetailsProps) => {
  const form = useForm<ReceiptFormData>({
    resolver: zodResolver(receiptFormSchema) as Resolver<ReceiptFormData>,
    defaultValues: getFormDataFromReceipt(initialReceipt),
    mode: "onChange",
  });

  return (
    <FormProvider {...form}>
      <Receipt receipt={initialReceipt} people={people} />
    </FormProvider>
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
