import { EnrichedReceiptData } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { ReceiptListItem } from "./receipt-list.item";
import { AddNewButtons } from "./add-new-buttons";

export const ReceiptsList = ({ receipts }: ReceiptsListProps) => {
  return (
    <div className="flex flex-col gap-4">
      <AddNewButtons />
      {receipts.map((x) => (
        <ReceiptListItem key={x.id} receipt={x} />
      ))}
    </div>
  );
};

type ReceiptsListProps = {
  receipts: EnrichedReceiptData[];
};
