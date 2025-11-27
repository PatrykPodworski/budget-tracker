"use server";

import { quickExpenseSchema } from "@budget-tracker/shared/quick-expense-schema";
import { getQuickExpenseContainer } from "./get-container";

export const getQuickExpense = async (id: string) => {
  const container = getQuickExpenseContainer();

  const data = await container.items
    .query<unknown>({
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [{ name: "@id", value: id }],
    })
    .fetchNext();

  const parsed = data.resources.map((item) =>
    quickExpenseSchema.parse(item)
  );

  return parsed[0];
};

