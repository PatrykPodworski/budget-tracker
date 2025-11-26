"use server";

import { env } from "@/env";
import { getQuickExpenseContainer } from "./get-container";

export const deleteQuickExpense = async (id: string) => {
  const partitionKey = env.TEMP_USER_ID;
  const container = getQuickExpenseContainer();

  await container.item(id, partitionKey).delete();
};

