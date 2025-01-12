import { getLatestReceipts } from "@/lib/receipt-data/get-latest-receipts";
import { ReceiptsList } from "@/components/receipt/receipt-list";

// TODO: P0 Link to details page and back
// TODO: P1 Show only basic info
// TODO: P1 Style receipt like a receipt
// TODO: P2 Image upload
// TODO: P3 Replace the bot
const Home = async () => {
  const receipts = await getLatestReceipts();

  return (
    <div className="flex flex-col gap-4 max-w-prose mx-auto">
      <ReceiptsList receipts={receipts} />
    </div>
  );
};

export default Home;
