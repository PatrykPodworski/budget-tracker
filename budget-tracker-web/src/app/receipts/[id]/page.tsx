import { Receipt } from "@/app/receipt";
import { getReceiptData } from "@/lib/receipt-data/get-receipt-data";

const ReceiptPage = async ({ params }: ReceiptPageProps) => {
  const { id } = await params;
  const receiptData = await getReceiptData(id);

  return (
    <div>
      <Receipt receipt={receiptData} />
    </div>
  );
};

type ReceiptPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default ReceiptPage;
