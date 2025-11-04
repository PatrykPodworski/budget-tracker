import { EnrichedReceiptData } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { ReceiptListItem } from "./receipt-list.item";
import { AddNewReceiptListItem } from "./add-new-receipt-list-item";

export const ReceiptsList = ({ receipts }: ReceiptsListProps) => {
  return (
    <div className="flex flex-col gap-4">
      <AddNewReceiptListItem />
      {receipts.map((x) => (
        <ReceiptListItem key={x.id} receipt={x} />
      ))}
    </div>
  );
};

type ReceiptsListProps = {
  receipts: EnrichedReceiptData[];
};
