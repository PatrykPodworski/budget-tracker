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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch("/api/expenses");

        if (!response.ok) {
          throw new Error(`Failed to fetch expenses: ${response.status}`);
        }

        const data = await response.json();
        const parsed = unifiedExpenseListSchema.parse(data);

        setExpenses(parsed);
      } catch (err) {
        console.error("Error fetching expenses:", err);
        setError(err instanceof Error ? err.message : "Failed to load expenses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  if (error) {
    return (
      <div className="flex flex-col gap-4">
        <AddNewButtons />
        <div className="text-center text-red-500 p-4">{error}</div>
      </div>
    );
  }

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
