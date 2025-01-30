"use server";

import { isCategory, ReceiptCategory } from "@/data/categories";
import { generateExcelFormulas } from "../excel-formula/generate-excel-formulas";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { bulkWrite, CellWrite } from "./basic-write";
import { getColumnToWrite, getRowToWrite, getSheetTitleToWrite } from "./utils";

// TODO: P1 Show counted and total mismatch
// TODO: P1 Split into multiple functions; write(what, where)
// TODO: P1 Write multiple cells API
// TODO: P2 Check for duplicated writes
// TODO: P2 Add comments for each write (comment, id, etc.)
// TODO: P3 Dynamic sheet month mapping
// TODO: P3 Dynamic sheet day mapping
export const writeReceipt = async (receipt: EnrichedReceiptData) => {
  if (!receipt.transactionDate) {
    return;
  }

  const { total, transactionDate } = receipt;
  const formulas = generateExcelFormulas(receipt.items);

  const sheetTitle = getSheetTitleToWrite(transactionDate);

  const categoryParams = Object.entries(formulas)
    .map(([category, formula]) =>
      getWriteParams(category, formula, transactionDate)
    )
    .filter((x) => x !== undefined);

  const expenseParam = getExpenseParam(transactionDate, total);
  const writeParams = [...categoryParams, expenseParam];

  await bulkWrite(sheetTitle, writeParams);
};

const getExpenseParam = (transactionDate: Date, total: number) => {
  const column = getColumnToWrite(transactionDate);
  const row = getRowToWrite();

  return { column, row, formula: total.toFixed(2) };
};

const getCellInfo = (transactionDate: Date, category: ReceiptCategory) => {
  const column = getColumnToWrite(transactionDate);
  const row = getRowToWrite(category);

  return { column, row };
};
const getWriteParams = (
  category: string,
  formula: string,
  transactionDate: Date
): CellWrite | undefined => {
  const isCategoryType = isCategory(category);
  if (!isCategoryType) {
    return undefined;
  }
  const cellInfo = getCellInfo(transactionDate, category);
  return { ...cellInfo, formula };
};
