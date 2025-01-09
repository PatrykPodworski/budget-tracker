import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { Receipt } from "./receipt";

// TODO: P1 Move to components
export const ReceiptsList = ({ receipts }: ReceiptsListProps) => {
  return (
    <div className="flex flex-col gap-4">
      {receipts.map((x) => (
        <Receipt key={x.id} receipt={x} />
      ))}
    </div>
  );
};

type ReceiptsListProps = {
  receipts: EnrichedReceiptData[];
};
