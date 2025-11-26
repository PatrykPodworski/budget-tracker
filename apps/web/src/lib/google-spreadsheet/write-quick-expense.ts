"use server";

import { bulkWrite } from "./bulk-write";
import { CellValidation } from "./cell-write";
import { getSheetTitleToWrite } from "./utils/get-sheet-title-to-write";
import { markQuickExpenseAsSent } from "../quick-expense/update";
import { PaymentParticipant } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { getCategoryParam } from "./utils/get-category-param";
import {
  getExpenseParams,
  getFormula,
  formatAmountWithCurrency,
} from "./utils/get-expense-params";
import { Currency } from "@budget-tracker/shared/currency";

export const writeQuickExpense = async ({
  expenseId,
  amount,
  currency,
  transactionDate,
  name,
  category,
  userId,
  paidBy,
}: WriteQuickExpenseParams) => {
  const expenseParams = getExpenseParams(
    transactionDate,
    amount,
    currency,
    name,
    expenseId,
    paidBy
  );

  const formula = getFormula(amount, currency);
  const noteAmount = formatAmountWithCurrency(amount, currency);
  const categoryParam = getCategoryParam(
    category,
    {
      formula,
      note: `${noteAmount}\t${name}`,
    },
    transactionDate
  );

  const writeParams = categoryParam
    ? [...expenseParams, categoryParam]
    : expenseParams;

  const validation: CellValidation = {
    type: "noteId",
    value: expenseId,
    column: expenseParams[0].column,
    row: expenseParams[0].row,
  };

  const sheetTitle = getSheetTitleToWrite(transactionDate);
  await bulkWrite(sheetTitle, writeParams, validation);

  console.log(`Quick expense ${expenseId}, user ${userId}`);
  await markQuickExpenseAsSent(expenseId, userId);
};

type WriteQuickExpenseParams = {
  expenseId: string;
  amount: number;
  currency: Currency;
  transactionDate: Date;
  name: string;
  category: string;
  userId: string;
  paidBy: PaymentParticipant[];
};
