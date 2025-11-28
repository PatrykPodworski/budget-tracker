import { Suspense } from "react";
import { AddNewButtons } from "@/components/receipt/receipt-list/add-new-buttons";
import { UnifiedExpenseListServer } from "@/components/unified-expense-list/unified-expense-list-server";
import { UnifiedExpenseListSkeleton } from "@/components/unified-expense-list/unified-expense-skeleton";

// TODO: P1 Fix handling multiple images at once
// TODO: P2 Style receipt like a receipt
// TODO: P2 Separate page for receipt details and receipt edit
// TODO: P2 Load more receipts on click
const Home = () => {
  return (
    <div className="flex flex-col mx-auto gap-4 max-w-prose">
      <AddNewButtons />
      <Suspense fallback={<UnifiedExpenseListSkeleton />}>
        <UnifiedExpenseListServer />
      </Suspense>
    </div>
  );
};

export default Home;
