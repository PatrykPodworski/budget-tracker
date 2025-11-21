import { env } from "@/env";

export const getExpenseRowForPerson = (personId: string): number => {
  const row = personToExpenseRowMap[personId];

  if (row === undefined) {
    throw new Error(`No expense row mapping found for person: ${personId}`);
  }

  return row;
};

const PATRYK_EXPENSES_ROW = 57;
const PAULINA_EXPENSES_ROW = 58;

const personToExpenseRowMap: Record<string, number> = {
  [env.TEMP_USER_ID]: PATRYK_EXPENSES_ROW,
  "person-2": PAULINA_EXPENSES_ROW,
};

