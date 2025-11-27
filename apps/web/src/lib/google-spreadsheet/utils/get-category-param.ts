import { isCategory } from "@/data/categories";
import { CellValues, CellWrite } from "../cell-write";
import { getColumnToWrite } from "./get-column-to-write";
import { getRowToWrite } from "./get-row-to-write";

export const getCategoryParam = (
  category: string,
  cellValues: CellValues,
  transactionDate: Date
): CellWrite | undefined => {
  if (!isCategory(category)) {
    return undefined;
  }

  const column = getColumnToWrite(transactionDate);
  const row = getRowToWrite(category);

  return {
    column,
    row,
    ...cellValues,
  };
};
