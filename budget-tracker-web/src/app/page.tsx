import { getLatestReceipts } from "@/lib/receipt-data/get-latest-receipts";
import { ReceiptsList } from "@/components/receipt/receipts-list";

// TODO: P1 Show data like the discord bot
// TODO: P2 Allow to update categories
const Home = async () => {
  const receipts = await getLatestReceipts();

  return (
    <main className="m-auto">
      <div className="flex flex-col gap-4 max-w-prose">
        <ReceiptsList receipts={receipts} />
      </div>
    </main>
  );
};

export default Home;
