"use client";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { ReceiptItem } from "./receipt-item";
import { EnrichedItem } from "@/models/enriched-item-schema";
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

// TODO: P2 Table view for desktop
// TODO: P3 Numbers formatting in inputs vs in labels
export const Receipt = ({
  receipt,
  onReceiptItemChange,
  onMerchantChange,
  onDateChange,
  onAddItem,
}: ReceiptProps) => {
  const { isLoading, debounced } = useDebounce(onMerchantChange);
  const { isLoading: isDateChangeLoading, debounced: debouncedOnDateChange } =
    useDebounce(onDateChange);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex flex-wrap mb-2 gap-4 sm:justify-between flex-col sm:flex-row ">
          <div className="flex gap-2 flex-wrap grow">
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
          </div>
          <DeleteReceiptButton id={receipt.id} />
        </div>
        <TotalPrice total={receipt.total} items={receipt.items} />
      </CardHeader>
      <CardContent>
        <CardTitle className="mb-2">Items</CardTitle>
        <div className="flex flex-col gap-8 sm:gap-4">
          {receipt.items.map((item, index) => (
            <ReceiptItem
              key={index}
              index={index}
              item={item}
              onItemChange={(newItem) => onReceiptItemChange(newItem, index)}
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
  onReceiptItemChange: (newItem: EnrichedItem, index: number) => Promise<void>;
  onMerchantChange: (newMerchant: string) => Promise<void>;
  onDateChange: (newDate: Date | undefined) => Promise<void>;
  onAddItem: () => Promise<void>;
};
