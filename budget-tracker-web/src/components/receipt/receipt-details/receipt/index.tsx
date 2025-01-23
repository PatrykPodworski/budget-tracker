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

// TODO: P1 Total price sum and compare to receipt total
// TODO: P2 Column headers
export const Receipt = ({
  receipt,
  onReceiptItemChange,
  onMerchantChange,
  onDateChange,
}: ReceiptProps) => {
  const { isLoading, debounced } = useDebounce(onMerchantChange);
  const { isLoading: isDateChangeLoading, debounced: debouncedOnDateChange } =
    useDebounce(onDateChange);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex gap-2 flex-wrap mb-2">
          <div className="w-full sm:max-w-60">
            <Label htmlFor="merchant">Merchant</Label>
            <Input
              id="merchant"
              defaultValue={receipt.merchantName}
              disabled={isLoading}
              onChange={(event) => debounced(event.target.value)}
            />
          </div>
          <div className="w-full sm:max-w-60">
            <Label htmlFor="transactionDate">Date</Label>
            <DateTimePicker
              disabled={isDateChangeLoading}
              defaultValue={receipt.transactionDate}
              onChange={debouncedOnDateChange}
            />
          </div>
        </div>
        <div className="flex gap-2 items-baseline">
          <Label htmlFor="total">Total</Label>
          <span id="total" className="text-base">
            {receipt.total} zł
          </span>
        </div>
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
};
