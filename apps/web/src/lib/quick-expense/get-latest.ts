import { quickExpenseSchema } from "@budget-tracker/shared/quick-expense-schema";
import { getQuickExpenseContainer } from "./get-container";

export const getLatestQuickExpenses = async () => {
  const container = getQuickExpenseContainer();

  const data = await container.items
    .query<unknown>(
      "SELECT * FROM c ORDER BY c.transactionDate DESC OFFSET 0 LIMIT 10"
    )
    .fetchAll();

  const parsed = data.resources.map((item) =>
    quickExpenseSchema.parse(item)
  );

  return parsed;
};

