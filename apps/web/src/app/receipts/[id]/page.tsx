import { ReceiptDetails } from "@/components/receipt/receipt-details";
import { Button } from "@/components/ui/shadcn/button";
import { getReceiptData } from "@/lib/receipt-data/get-receipt-data";
import { people } from "@/data/people";
import Link from "next/link";

const ReceiptPage = async ({ params }: ReceiptPageProps) => {
  const { id } = await params;
  const receiptData = await getReceiptData(id);

  return (
    <div className="flex flex-col gap-4 items-center mb-4">
      <ReceiptDetails receipt={receiptData} people={people} />
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
