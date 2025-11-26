import { getLatestReceipts } from "@/lib/receipt-data/get-latest-receipts";
import { getLatestQuickExpenses } from "@/lib/quick-expense/get-latest";
import { mergeAndSortExpenses } from "@budget-tracker/shared/unified-expense-schema";
import { UnifiedExpensesList } from "@/components/unified-expense-list";

// TODO: P1 Fix handling multiple images at once
// TODO: P2 Style receipt like a receipt
// TODO: P2 Separate page for receipt details and receipt edit
// TODO: P2 Load more receipts on click
const Home = async () => {
  const [receipts, quickExpenses] = await Promise.all([
    getLatestReceipts(),
    getLatestQuickExpenses(),
  ]);

  const unifiedExpenses = mergeAndSortExpenses(receipts, quickExpenses);

  return (
    <div className="flex flex-col mx-auto gap-4 max-w-prose">
      <UnifiedExpensesList expenses={unifiedExpenses} />
      <div className="text-center w-full text-zinc-200">
        {new Date().toISOString()}
      </div>
    </div>
  );
};

export default Home;
