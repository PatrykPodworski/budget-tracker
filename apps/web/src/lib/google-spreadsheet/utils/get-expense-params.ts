import { PaymentParticipant } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { CellWrite } from "../cell-write";
import { formatCurrency } from "../../utils";
import { getColumnToWrite } from "./get-column-to-write";
import { getExpenseRowForPerson } from "./get-expense-row-for-person";
import {
  Currency,
  exchangeRates,
  convertToBaseCurrency,
} from "@budget-tracker/shared/currency";

export const getExpenseParams = (
  transactionDate: Date,
  amount: number,
  currency: Currency,
  label: string | undefined,
  id: string,
  paidBy: PaymentParticipant[]
): CellWrite[] => {
  const column = getColumnToWrite(transactionDate);

  return paidBy.map(({ personId, sharePercentage }) => {
    const row = getExpenseRowForPerson(personId);
    const personAmount = (amount * sharePercentage) / 100;
    const formula = getFormula(personAmount, currency);
    const noteAmount = formatAmountWithCurrency(personAmount, currency);

    return {
      column,
      row,
      formula,
      note: `${noteAmount}\t${label} ${id}`,
    };
  });
};

export const getFormula = (amount: number, currency: Currency) =>
  `${amount}*${exchangeRates[currency]}`;

export const formatAmountWithCurrency = (
  amount: number,
  currency: Currency
) => {
  const amountPLN = convertToBaseCurrency(amount, currency);
  return `${amount} ${currency} (${formatCurrency(amountPLN)})`;
};
