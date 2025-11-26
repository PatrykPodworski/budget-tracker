import { EnrichedReceiptData } from "./enriched-receipt-data-schema";
import { QuickExpense } from "./quick-expense-schema";

export type UnifiedExpense =
  | { type: "receipt"; data: EnrichedReceiptData }
  | { type: "quick-expense"; data: QuickExpense };

export const mergeAndSortExpenses = (
  receipts: EnrichedReceiptData[],
  quickExpenses: QuickExpense[]
): UnifiedExpense[] => {
  const unified: UnifiedExpense[] = [
    ...receipts.map((receipt) => ({ type: "receipt" as const, data: receipt })),
    ...quickExpenses.map((expense) => ({
      type: "quick-expense" as const,
      data: expense,
    })),
  ];

  return unified
    .sort((a, b) => {
      const dateA = a.data.transactionDate?.getTime() ?? 0;
      const dateB = b.data.transactionDate?.getTime() ?? 0;
      return dateB - dateA; // DESC order (newest first)
    })
    .slice(0, 10); // Take top 10
};

