import { getLatestReceipts } from "@/lib/receipt-data/get-latest-receipts";
import { ReceiptsList } from "@/components/receipt/receipt-list";

export const revalidate = 60;

// TODO: P1 Style receipt like a receipt
// TODO: P2 Image upload
// TODO: P3 Replace the bot
const Home = async () => {
  const receipts = await getLatestReceipts();

  return (
    <div className="flex flex-col mx-auto gap-4 max-w-prose">
      <ReceiptsList receipts={receipts} />
    </div>
  );
};

export default Home;
