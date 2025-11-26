import { UnifiedExpense } from "@budget-tracker/shared/unified-expense-schema";
import { UnifiedExpenseItem } from "./unified-expense-item";
import { AddNewButtons } from "../receipt/receipt-list/add-new-buttons";

export const UnifiedExpensesList = ({
  expenses,
}: UnifiedExpensesListProps) => {
  return (
    <div className="flex flex-col gap-4">
      <AddNewButtons />
      {expenses.map((expense) => (
        <UnifiedExpenseItem
          key={`${expense.type}-${expense.data.id}`}
          expense={expense}
        />
      ))}
    </div>
  );
};

type UnifiedExpensesListProps = {
  expenses: UnifiedExpense[];
};

