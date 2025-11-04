"use server";

import { isCategory } from "@/data/categories";
import { getCategoryCellValues } from "./get-category-cell-values";
import { bulkWrite } from "./bulk-write";
import { CellValidation, CellValues, CellWrite } from "./cell-write";
import { getRowToWrite } from "./utils/get-row-to-write";
import { getColumnToWrite } from "./utils/get-column-to-write";
import { formatCurrency } from "../utils";
import { EnrichedItem } from "@budget-tracker/shared/enriched-item-schema";
import { getSheetTitleToWrite } from "./utils/get-sheet-title-to-write";
import { validateReceipt } from "./validate-receipt";
import { markReceiptAsSent } from "../receipt-data/update";

export const writeReceipt = async ({
  receiptId,
  total,
  transactionDate,
  merchantName,
  items,
  userId,
}: WriteReceiptParams) => {
  const expenseParam = getExpenseParam(
    transactionDate,
    total,
    merchantName,
    receiptId
  );

  // Validate receipt before writing
  // TODO: P0 Check if can be done in a single document load
  const validationResult = await validateReceipt({
    receiptId,
    transactionDate,
    expenseCellInfo: {
      column: expenseParam.column,
      row: expenseParam.row,
    },
  });

  // Skip writing if validation fails
  if (!validationResult.isValid) {
    console.log(`Receipt validation failed: ${validationResult.message}`);
    return;
  }

  const categories = getCategoryCellValues(items);
  const sheetTitle = getSheetTitleToWrite(transactionDate);
  const categoryParams = getCategoryParams(categories, transactionDate);
  const writeParams = [...categoryParams, expenseParam];
  const validation: CellValidation = {
    type: "noteId",
    value: receiptId,
    column: expenseParam.column,
    row: expenseParam.row,
  };

  await bulkWrite(sheetTitle, writeParams, validation);

  // TODO: P0 This cannot be in google spreadsheet lib
  console.log(`Receipt ${receiptId}, user ${userId}`);
  await markReceiptAsSent(receiptId, userId);
};

type WriteReceiptParams = {
  transactionDate: Date;
  items: EnrichedItem[]; // TODO: P2 Limit the fields
  total: number;
  merchantName: string | undefined;
  receiptId: string;
  userId: string;
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
    note: `${formatCurrency(total)}\t${merchantName} ${receiptId}`,
  };

  return param;
};
