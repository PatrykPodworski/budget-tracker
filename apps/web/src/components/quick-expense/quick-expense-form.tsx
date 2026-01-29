"use client";

import { useRouter } from "next/navigation";
import { useForm, FormProvider, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { QuickExpenseFormContent } from "./quick-expense-form-content";
import { Person } from "@/data/people";
import { QuickExpense } from "@budget-tracker/shared/quick-expense-schema";
import {
  quickExpenseFormSchema,
  type QuickExpenseFormData,
} from "@/lib/quick-expense/quick-expense-form-schema";
import { categories } from "@/data/categories";

export const QuickExpenseForm = ({
  quickExpense,
  people,
  defaultUserId,
}: QuickExpenseFormProps) => {
  const router = useRouter();
  const isEditMode = !!quickExpense;

  const form = useForm<QuickExpenseFormData>({
    resolver: zodResolver(quickExpenseFormSchema) as Resolver<QuickExpenseFormData>,
    defaultValues: quickExpense
      ? getDefaultValuesFromQuickExpense(quickExpense)
      : getInitialDefaultValues(defaultUserId),
    mode: "onChange",
  });

  return (
    <FormProvider {...form}>
      <QuickExpenseFormContent
        quickExpense={quickExpense}
        people={people}
        defaultUserId={defaultUserId}
        isEditMode={isEditMode}
        router={router}
      />
    </FormProvider>
  );
};

type QuickExpenseFormProps = {
  quickExpense?: QuickExpense;
  people: readonly Person[];
  defaultUserId: string;
};

const getInitialDefaultValues = (
  defaultUserId: string
): QuickExpenseFormData => ({
  name: "",
  category: categories[0],
  total: 0,
  currency: "PLN",
  transactionDate: new Date(),
  paidBy: [{ personId: defaultUserId, sharePercentage: 100 }],
});

const getDefaultValuesFromQuickExpense = (
  expense: QuickExpense
): QuickExpenseFormData => ({
  name: expense.name,
  category: expense.category,
  total: expense.amount,
  currency: expense.currency,
  transactionDate: expense.transactionDate,
  paidBy: expense.paidBy,
});
