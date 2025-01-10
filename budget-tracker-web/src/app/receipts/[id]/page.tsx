import { getReceiptData } from "@/lib/receipt-data/get-receipt-data";

const ReceiptPage = async ({ params }: ReceiptPageProps) => {
  const { id } = await params;
  const receiptData = await getReceiptData(id);

  return (
    <div>
      <h1>Receipt {id}</h1>
      <pre>{JSON.stringify(receiptData, null, 2)}</pre>
    </div>
  );
};

type ReceiptPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default ReceiptPage;
