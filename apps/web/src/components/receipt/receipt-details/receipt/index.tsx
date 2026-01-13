"use client";
import { useState } from "react";
import { EnrichedReceiptData } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { EnrichedItem } from "@budget-tracker/shared/enriched-item-schema";
import { Label } from "@/components/ui/shadcn/label";
import { Input } from "@/components/ui/shadcn/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import { TotalPrice } from "./total-price";
import { DeleteReceiptButton } from "./delete-receipt-button";
import { PaidBy } from "./paid-by";
import { Person } from "@/data/people";
import { ReceiptFormData } from "@/lib/receipt-data/update";
import { ReceiptSaveButtons, SaveMessage } from "./receipt-save-buttons";
import { ReceiptItemList } from "./receipt-item-list";

// TODO: P2 Table view for desktop
// TODO: P3 Numbers formatting in inputs vs in labels
export const Receipt = ({
  receipt: initialReceipt,
  people,
  hasChanges,
  onFormChange,
}: ReceiptProps) => {
  const [isSentToBudget, setIsSentToBudget] = useState(
    initialReceipt.isSentToBudget
  );
  const [saveMessage, setSaveMessage] = useState<SaveMessage | null>(null);

  const receipt = { ...initialReceipt, isSentToBudget };

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
                  onChange={(e) =>
                    onFormChange({ merchantName: e.target.value })
                  }
                />
              </div>
              <div className="w-full sm:w-auto md:w-full sm:max-w-60">
                <Label htmlFor="transactionDate">Date</Label>
                <DateTimePicker
                  defaultValue={receipt.transactionDate}
                  onChange={(date) => onFormChange({ transactionDate: date })}
                />
              </div>
              <PaidBy
                paidBy={receipt.paidBy}
                total={receipt.total}
                people={people}
                onChange={(paidBy) => onFormChange({ paidBy })}
              />
            </div>
            <TotalPrice
              total={receipt.total}
              items={receipt.items}
              onTotalChange={(total) => onFormChange({ total })}
            />
          </div>
          <div className="flex sm:flex-col gap-2">
            <DeleteReceiptButton id={receipt.id} />
          </div>
        </div>
        <ReceiptSaveButtons
          receipt={receipt}
          hasChanges={hasChanges}
          saveMessage={saveMessage}
          setSaveMessage={setSaveMessage}
          setIsSentToBudget={setIsSentToBudget}
        />
      </CardHeader>
      <CardContent>
        <CardTitle className="mb-2">Items</CardTitle>
        <div className="flex flex-col gap-8 sm:gap-4">
          <ReceiptItemList
            items={receipt.items}
            onItemsChange={(items) =>
              onFormChange({
                items: items,
              })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

type ReceiptProps = {
  receipt: EnrichedReceiptData;
  people: readonly Person[];
  hasChanges: boolean;
  onFormChange: (update: Partial<ReceiptFormData>) => void;
};
