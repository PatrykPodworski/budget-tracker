import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { ReceiptListItem } from "./receipt-list.item";

export const ReceiptsList = ({ receipts }: ReceiptsListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {receipts.map((x) => (
        <ReceiptListItem key={x.id} receipt={x} />
      ))}
    </div>
  );
};

type ReceiptsListProps = {
  receipts: EnrichedReceiptData[];
};
