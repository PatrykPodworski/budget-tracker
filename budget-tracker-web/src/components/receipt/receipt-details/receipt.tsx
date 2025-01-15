"use client";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { ReceiptItem } from "./receipt-item";
import { formatDate } from "@/lib/utils";
import { EnrichedItem } from "@/models/enriched-item-schema";
import { Label } from "@/components/ui/shadcn/label";
import { Input } from "@/components/ui/shadcn/input";
import { Card, CardContent, CardHeader } from "@/components/ui/shadcn/card";
import { useDebounce } from "@/lib/utils/use-debounce";

// TODO: P2 Keep focus after disabling input
export const Receipt = ({
  receipt,
  onReceiptItemChange,
  onMerchantChange,
}: ReceiptProps) => {
  const { isLoading, debounced } = useDebounce(onMerchantChange);

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <div className="max-w-80">
          <Label htmlFor="merchant">Merchant</Label>
          <Input
            id="merchant"
            defaultValue={receipt.merchantName}
            disabled={isLoading}
            onChange={(event) => debounced(event.target.value)}
          />
        </div>
        <div>
          <b>Date:&nbsp;</b>
          {formatDate(receipt.transactionDate)}
        </div>
        <div>
          <b>Amount:</b>&nbsp;{receipt.total} zł
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {receipt.items.map((item, index) => (
            <ReceiptItem
              key={index}
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
};
