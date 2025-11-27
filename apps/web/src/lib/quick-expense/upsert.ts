"use server";

import { env } from "@/env";
import { getQuickExpenseContainer } from "./get-container";
import {
  QuickExpense,
  quickExpenseSchema,
} from "@budget-tracker/shared/quick-expense-schema";
import {
  Currency,
  convertToBaseCurrency,
} from "@budget-tracker/shared/currency";
import { PaymentParticipant } from "@budget-tracker/shared/enriched-receipt-data-schema";

export const upsertQuickExpense = async (
  data: UpsertQuickExpenseInput
): Promise<QuickExpense> => {
  const container = getQuickExpenseContainer();

  const amountPLN = convertToBaseCurrency(data.amount, data.currency);
  const id = data.id ?? crypto.randomUUID();

  const quickExpense = {
    id,
    userId: env.TEMP_USER_ID,
    name: data.name,
    category: data.category,
    amount: data.amount,
    currency: data.currency,
    amountPLN,
    transactionDate: data.transactionDate.toISOString(),
    paidBy: data.paidBy,
    isSentToBudget: data.isSentToBudget,
    createdAt: data.createdAt.toISOString(),
  };

  const { resource } = await container.items.upsert(quickExpense);

  return quickExpenseSchema.parse(resource);
};

type UpsertQuickExpenseInput = {
  id?: string;
  name: string;
  category: string;
  amount: number;
  currency: Currency;
  transactionDate: Date;
  paidBy: PaymentParticipant[];
  isSentToBudget: boolean;
  createdAt: Date;
};
