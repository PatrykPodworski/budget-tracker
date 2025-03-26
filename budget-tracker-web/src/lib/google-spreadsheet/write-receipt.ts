"use server";

import { isCategory } from "@/data/categories";
import { getCategoryCellValues } from "./get-category-cell-values";
import { bulkWrite } from "./bulk-write";
import { CellValues, CellWrite } from "./cell-write";
import { getRowToWrite } from "./utils/get-row-to-write";
import { getColumnToWrite } from "./utils/get-column-to-write";
import { formatCurrency } from "../utils";
import { EnrichedItem } from "@/models/enriched-item-schema";
import { getSheetTitleToWrite } from "./utils/get-sheet-title-to-write";

// TODO: P2 Check for duplicated writes
export const writeReceipt = async ({
  receiptId,
  total,
  transactionDate,
  merchantName,
  items,
}: WriteReceiptParams) => {
  const categories = getCategoryCellValues(items);

  const sheetTitle = getSheetTitleToWrite(transactionDate);

  const categoryParams = getCategoryParams(categories, transactionDate);
  const expenseParam = getExpenseParam(
    transactionDate,
    total,
    merchantName,
    receiptId
  );
  const writeParams = [...categoryParams, expenseParam];

  await bulkWrite(sheetTitle, writeParams);
};

type WriteReceiptParams = {
  transactionDate: Date;
  items: EnrichedItem[]; // TODO: P2 Limit the fields
  total: number;
  merchantName: string | undefined;
  receiptId: string;
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
  merchantName: string | undefined,
  receiptId: string
) => {
  const column = getColumnToWrite(transactionDate);
  const row = getRowToWrite();

  const param: CellWrite = {
    column,
    row,
    formula: total.toFixed(2),
    comment: `${formatCurrency(total)}\t${merchantName} ${receiptId}`,
  };

  return param;
};
