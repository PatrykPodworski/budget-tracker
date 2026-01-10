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
import { splitAmount } from "../../utils/split-amount";

export const getExpenseParams = (
  transactionDate: Date,
  amount: number,
  currency: Currency,
  label: string | undefined,
  id: string,
  paidBy: PaymentParticipant[]
): CellWrite[] => {
  const column = getColumnToWrite(transactionDate);
  const amounts = splitAmount(amount, paidBy.length);

  return paidBy.map(({ personId }, index) => {
    const row = getExpenseRowForPerson(personId);
    const personAmount = amounts[index];
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
  `${amount.toFixed(2)}*${exchangeRates[currency]}`;

export const formatAmountWithCurrency = (
  amount: number,
  currency: Currency
) => {
  const amountPLN = convertToBaseCurrency(amount, currency);
  return `${amount} ${currency} (${formatCurrency(amountPLN)})`;
};
