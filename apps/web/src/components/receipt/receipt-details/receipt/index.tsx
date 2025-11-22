"use client";
import {
  EnrichedReceiptData,
  PaymentParticipant,
} from "@budget-tracker/shared/enriched-receipt-data-schema";
import { ReceiptItem } from "./receipt-item";
import { EnrichedItem } from "@budget-tracker/shared/enriched-item-schema";
import { Label } from "@/components/ui/shadcn/label";
import { Input } from "@/components/ui/shadcn/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { useDebounce } from "@/lib/utils/use-debounce";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { TotalPrice } from "./total-price";
import { DeleteReceiptButton } from "./delete-receipt-button";
import { AddReceiptItem } from "./add-receipt-item";
import { SendToBudgetButton } from "../send-to-budget-button";
import { PaidBy } from "./paid-by";
import { Person } from "@/data/people";

// TODO: P2 Table view for desktop
// TODO: P3 Numbers formatting in inputs vs in labels
export const Receipt = ({
  receipt,
  people,
  onReceiptItemChange,
  onMerchantChange,
  onDateChange,
  onPaidByChange,
  onTotalChange,
  onAddItem,
  onItemDelete,
}: ReceiptProps) => {
  const { isLoading, debounced } = useDebounce(onMerchantChange);
  const { isLoading: isDateChangeLoading, debounced: debouncedOnDateChange } =
    useDebounce(onDateChange);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="sm:pb-0">
        <div className="flex flex-wrap mb-2 gap-4 sm:justify-between flex-col sm:flex-row ">
          <div className="flex flex-col grow gap-4">
            <div className="flex gap-2 flex-wrap">
              <div className="w-full sm:w-auto md:w-full sm:max-w-60">
                <Label htmlFor="merchant">Merchant</Label>
                <Input
                  id="merchant"
                  defaultValue={receipt.merchantName}
                  disabled={isLoading}
                  onChange={(event) => debounced(event.target.value)}
                />
              </div>
              <div className="w-full sm:w-auto md:w-full sm:max-w-60">
                <Label htmlFor="transactionDate">Date</Label>
                <DateTimePicker
                  disabled={isDateChangeLoading}
                  defaultValue={receipt.transactionDate}
                  onChange={debouncedOnDateChange}
                />
              </div>
              <PaidBy
                paidBy={receipt.paidBy}
                total={receipt.total}
                people={people}
                onChange={onPaidByChange}
              />
            </div>
            <TotalPrice
              total={receipt.total}
              items={receipt.items}
              onTotalChange={onTotalChange}
            />
          </div>
          <div className="flex sm:flex-col gap-2">
            <SendToBudgetButton receipt={receipt} />
            <DeleteReceiptButton id={receipt.id} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="mb-2">Items</CardTitle>
        <div className="flex flex-col gap-8 sm:gap-4">
          {receipt.items.map((item, index) => (
            <ReceiptItem
              key={`${item.name}-${index}`}
              index={index}
              item={item}
              onItemChange={async (newItem) =>
                await onReceiptItemChange(newItem, index)
              }
              onItemDelete={async () => await onItemDelete(index)}
            />
          ))}
          <AddReceiptItem onAddItem={onAddItem} />
        </div>
      </CardContent>
    </Card>
  );
};

type ReceiptProps = {
  receipt: EnrichedReceiptData;
  people: readonly Person[];
  onReceiptItemChange: (newItem: EnrichedItem, index: number) => Promise<void>;
  onMerchantChange: (newMerchant: string) => Promise<void>;
  onDateChange: (newDate: Date | undefined) => Promise<void>;
  onPaidByChange: (paidBy: PaymentParticipant[]) => Promise<void>;
  onTotalChange: (newTotal: number) => Promise<void>;
  onAddItem: () => Promise<void>;
  onItemDelete: (index: number) => Promise<void>;
};
