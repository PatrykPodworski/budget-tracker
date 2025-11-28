import { getLatestReceipts } from "@/lib/receipt-data/get-latest-receipts";
import { getLatestQuickExpenses } from "@/lib/quick-expense/get-latest";
import { mergeAndSortExpenses } from "@budget-tracker/shared/unified-expense-schema";
import { UnifiedExpenseItem } from "./unified-expense-item";

export const UnifiedExpenseListServer = async () => {
  const [receipts, quickExpenses] = await Promise.all([
    getLatestReceipts(),
    getLatestQuickExpenses(),
  ]);

  const expenses = mergeAndSortExpenses(receipts, quickExpenses);

  return (
    <>
      {expenses.map((expense) => (
        <UnifiedExpenseItem
          key={`${expense.type}-${expense.data.id}`}
          expense={expense}
        />
      ))}
    </>
  );
};
