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
import { splitAmount } from "@budget-tracker/shared/split-amount";

export const getExpenseParams = (
  transactionDate: Date,
  amount: number,
  currency: Currency,
  label: string | undefined,
  id: string,
  paidBy: PaymentParticipant[]
): CellWrite[] => {
  const column = getColumnToWrite(transactionDate);

  // Use splitAmount to handle rounding correctly
  // This ensures the sum of individual amounts equals the original total
  const splitResults = splitAmount(
    amount,
    paidBy.map((p) => ({ id: p.personId, sharePercentage: p.sharePercentage }))
  );

  // Create a map for quick lookup of split amounts by person ID
  const amountByPersonId = new Map(
    splitResults.map((r) => [r.id, r.amount])
  );

  return paidBy.map(({ personId }) => {
    const row = getExpenseRowForPerson(personId);
    const personAmount = amountByPersonId.get(personId)!;
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
