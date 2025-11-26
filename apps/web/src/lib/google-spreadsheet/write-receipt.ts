"use server";

import { getCategoryCellValues } from "./get-category-cell-values";
import { bulkWrite } from "./bulk-write";
import { CellValidation, CellValues } from "./cell-write";
import { EnrichedItem } from "@budget-tracker/shared/enriched-item-schema";
import { getSheetTitleToWrite } from "./utils/get-sheet-title-to-write";
import { validateReceipt } from "./validate-receipt";
import { markReceiptAsSent } from "../receipt-data/update";
import { PaymentParticipant } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { getExpenseParams } from "./utils/get-expense-params";
import { getCategoryParam } from "./utils/get-category-param";

export const writeReceipt = async ({
  receiptId,
  total,
  transactionDate,
  merchantName,
  items,
  userId,
  paidBy,
}: WriteReceiptParams) => {
  const expenseParams = getExpenseParams(
    transactionDate,
    total,
    "PLN",
    merchantName,
    receiptId,
    paidBy
  );

  // Validate receipt before writing
  // TODO: P0 Check if can be done in a single document load
  const validationResult = await validateReceipt({
    receiptId,
    transactionDate,
    expenseCellInfo: {
      column: expenseParams[0].column,
      row: expenseParams[0].row,
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
  const writeParams = [...categoryParams, ...expenseParams];
  const validation: CellValidation = {
    type: "noteId",
    value: receiptId,
    column: expenseParams[0].column,
    row: expenseParams[0].row,
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
  paidBy: PaymentParticipant[];
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
