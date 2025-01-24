import { ReceiptDetails } from "@/components/receipt/receipt-details";
import { Button } from "@/components/ui/shadcn/button";
import { basicWrite } from "@/lib/google-spreadsheet/basic-write";
import { getReceiptData } from "@/lib/receipt-data/get-receipt-data";
import Link from "next/link";

// TODO: P1 Add data to Excel automatically
// TODO: P1 Add link to this page in bot
const ReceiptPage = async ({ params }: ReceiptPageProps) => {
  const { id } = await params;
  const receiptData = await getReceiptData(id);
  await basicWrite();

  return (
    <div className="flex flex-col gap-4 items-center mb-4">
      <ReceiptDetails receipt={receiptData} />
      <Button
        asChild
        variant="outline"
        className="self-stretch mx-2 sm:self-center"
      >
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
