"use server";

import { getQuickExpenseContainer } from "./get-container";
import {
  QuickExpense,
  quickExpenseSchema,
} from "@budget-tracker/shared/quick-expense-schema";

export const markQuickExpenseAsSent = async (
  id: string,
  partitionKey: string
): Promise<QuickExpense> => {
  const container = getQuickExpenseContainer();

  const { resource } = await container.item(id, partitionKey).patch({
    operations: [{ op: "replace", path: "/isSentToBudget", value: true }],
  });

  return quickExpenseSchema.parse(resource);
};
