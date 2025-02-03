"use server";

import { isCategory } from "@/data/categories";
import { getCategoryCellValues } from "../excel-formula/get-category-cell-values";
import { EnrichedReceiptData } from "@/models/enriched-receipt-data-schema";
import { bulkWrite, CellValues, CellWrite } from "./basic-write";
import { getColumnToWrite, getRowToWrite, getSheetTitleToWrite } from "./utils";
import { formatCurrency } from "../utils";

// TODO: P0 Split into multiple functions; write(what, where)
// TODO: P2 Check for duplicated writes
// TODO: P3 Dynamic sheet month mapping
// TODO: P3 Dynamic sheet day mapping
export const writeReceipt = async (receipt: EnrichedReceiptData) => {
  if (!receipt.transactionDate) {
    return;
  }

  const { total, transactionDate, merchantName } = receipt;
  const categories = getCategoryCellValues(receipt.items);

  const sheetTitle = getSheetTitleToWrite(transactionDate);

  const categoryParams = getCategoryParams(categories, transactionDate);
  const expenseParam = getExpenseParam(transactionDate, total, merchantName);
  const writeParams = [...categoryParams, expenseParam];

  await bulkWrite(sheetTitle, writeParams);
};

const getCategoryParams = (
  categories: Record<string, CellValues>,
  transactionDate: Date
) =>
  Object.entries(categories)
    .map(([category, cellValues]) =>
      getCategoryParam(category, cellValues, transactionDate)
    )
    .filter((x) => x !== undefined);

const getCategoryParam = (
  category: string,
  cellValues: CellValues,
  transactionDate: Date
) => {
  const isCategoryType = isCategory(category);
  if (!isCategoryType) {
    return undefined;
  }

  const column = getColumnToWrite(transactionDate);
  const row = getRowToWrite(category);

  const writeParam: CellWrite = {
    column,
    row,
    ...cellValues,
  };

  return writeParam;
};

const getExpenseParam = (
  transactionDate: Date,
  total: number,
  merchantName: string | undefined
) => {
  const column = getColumnToWrite(transactionDate);
  const row = getRowToWrite();

  const param: CellWrite = {
    column,
    row,
    formula: total.toFixed(2),
    comment: `${formatCurrency(total)}\t${merchantName}`,
  };

  return param;
};
