import Link from "next/link";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/shadcn/card";
import { Button } from "@/components/ui/shadcn/button";
import { ReceiptStatusIcon } from "./receipt-status-icon";

export const ReceiptListItem = ({ receipt }: ReceiptListItemProps) => (
  <Card>
    <CardContent>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <div className="flex items-center gap-1">
            <ReceiptStatusIcon isSent={receipt.isSentToBudget} />
            <h3 className="text-lg font-semibold">{receipt.merchantName}</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDateTime(receipt.transactionDate)}
          </p>
        </div>
        <div className="flex flex-row items-center gap-2">
          <p className="text-lg font-bold">{formatCurrency(receipt.total)}</p>
          <Link href={`/receipts/${receipt.id}`} passHref>
            <Button variant="outline">View Details</Button>
          </Link>
        </div>
      </div>
    </CardContent>
  </Card>
);

type ReceiptListItemProps = {
  receipt: EnrichedReceiptData;
};
