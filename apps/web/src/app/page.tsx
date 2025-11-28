import { UnifiedExpenseListDynamic } from "@/components/unified-expense-list/unified-expense-list-dynamic";

// TODO: P1 Fix handling multiple images at once
// TODO: P2 Style receipt like a receipt
// TODO: P2 Separate page for receipt details and receipt edit
// TODO: P2 Load more receipts on click
const Home = () => {
  return (
    <div className="flex flex-col mx-auto gap-4 max-w-prose">
      <UnifiedExpenseListDynamic />
    </div>
  );
};

export default Home;
