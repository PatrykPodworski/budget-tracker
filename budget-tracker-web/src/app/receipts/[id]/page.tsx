import { ReceiptDetails } from "@/components/receipt/receipt-details";
import { getReceiptData } from "@/lib/receipt-data/get-receipt-data";

// TODO: P0 Prettier Excel output
// TODO: P1 Save the updated data in cosmos
// TODO: P1 Add link to this page in bot
// TODO: P2 Add data to Excel automatically
const ReceiptPage = async ({ params }: ReceiptPageProps) => {
  const { id } = await params;
  const receiptData = await getReceiptData(id);

  return <ReceiptDetails receipt={receiptData} />;
};

type ReceiptPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default ReceiptPage;
