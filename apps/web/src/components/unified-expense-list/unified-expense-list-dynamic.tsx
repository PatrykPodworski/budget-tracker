"use client";

import { useEffect, useState } from "react";
import { UnifiedExpense } from "@budget-tracker/shared/unified-expense-schema";
import { UnifiedExpenseItem } from "./unified-expense-item";
import { AddNewButtons } from "../receipt/receipt-list/add-new-buttons";
import { UnifiedExpenseListSkeleton } from "./unified-expense-skeleton";

type UnifiedExpenseJson = {
  type: "receipt" | "quick-expense";
  data: {
    id: string;
    transactionDate?: string;
    createdAt?: string;
    [key: string]: unknown;
  };
};

export const UnifiedExpenseListDynamic = () => {
  const [expenses, setExpenses] = useState<UnifiedExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchExpenses = async () => {
      const response = await fetch("/api/expenses");
      const data: UnifiedExpenseJson[] = await response.json();

      // Parse dates from JSON strings
      const parsed = data.map((expense) => ({
        ...expense,
        data: {
          ...expense.data,
          transactionDate: expense.data.transactionDate
            ? new Date(expense.data.transactionDate)
            : undefined,
          ...(expense.type === "quick-expense" &&
            expense.data.createdAt && {
              createdAt: new Date(expense.data.createdAt),
            }),
        },
      })) as UnifiedExpense[];

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
