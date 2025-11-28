"use client";

import { useEffect, useState } from "react";
import {
  UnifiedExpense,
  unifiedExpenseListSchema,
} from "@budget-tracker/shared/unified-expense-schema";
import { UnifiedExpenseItem } from "./unified-expense-item";
import { AddNewButtons } from "../receipt/receipt-list/add-new-buttons";
import { UnifiedExpenseListSkeleton } from "./unified-expense-skeleton";

export const UnifiedExpenseListDynamic = () => {
  const [expenses, setExpenses] = useState<UnifiedExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      const response = await fetch("/api/expenses");
      const data = await response.json();
      const parsed = unifiedExpenseListSchema.parse(data);

      setExpenses(parsed);
      setIsLoading(false);
    };

    fetchExpenses();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <AddNewButtons />
      {isLoading ? (
        <UnifiedExpenseListSkeleton />
      ) : (
        expenses.map((expense) => (
          <UnifiedExpenseItem
            key={`${expense.type}-${expense.data.id}`}
            expense={expense}
          />
        ))
      )}
    </div>
  );
};
