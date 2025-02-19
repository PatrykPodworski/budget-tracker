import { getLatestReceipts } from "@/lib/receipt-data/get-latest-receipts";
import { ReceiptsList } from "@/components/receipt/receipt-list";

// TODO: P1 Fix handling multiple images at once
// TODO: P1 Style receipt like a receipt
// TODO: P1 Separate page for receipt details and receipt edit
// TODO: P2 Load more receipts on click
const Home = async () => {
  const receipts = await getLatestReceipts();

  return (
    <div className="flex flex-col mx-auto gap-4 max-w-prose">
      <ReceiptsList receipts={receipts} />
      <div className="text-center w-full text-zinc-200">
        {new Date().toISOString()}
      </div>
    </div>
  );
};

export default Home;
