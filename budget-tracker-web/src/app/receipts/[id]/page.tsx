import { ReceiptDetails } from "@/components/receipt/receipt-details";
import { Button } from "@/components/ui/shadcn/button";
import { getReceiptData } from "@/lib/receipt-data/get-receipt-data";
import Link from "next/link";

// TODO: P0 Prettier Excel output
// TODO: P1 Add link to this page in bot
// TODO: P2 Add data to Excel automatically
const ReceiptPage = async ({ params }: ReceiptPageProps) => {
  const { id } = await params;
  const receiptData = await getReceiptData(id);

  return (
    <div className="flex flex-col gap-4 items-center">
      <ReceiptDetails receipt={receiptData} />
      <Button asChild variant="outline">
        <Link href="/">Back</Link>
      </Button>
    </div>
  );
};

type ReceiptPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default ReceiptPage;
