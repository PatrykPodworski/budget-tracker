import { z } from "zod";
import {
  enrichedReceiptDataSchema,
  EnrichedReceiptData,
} from "./enriched-receipt-data-schema";
import { quickExpenseSchema, QuickExpense } from "./quick-expense-schema";

export type UnifiedExpense =
  | { type: "receipt"; data: EnrichedReceiptData }
  | { type: "quick-expense"; data: QuickExpense };

const unifiedReceiptSchema = z.object({
  type: z.literal("receipt"),
  data: enrichedReceiptDataSchema,
});

const unifiedQuickExpenseSchema = z.object({
  type: z.literal("quick-expense"),
  data: quickExpenseSchema,
});

export const unifiedExpenseSchema = z.discriminatedUnion("type", [
  unifiedReceiptSchema,
  unifiedQuickExpenseSchema,
]);

export const unifiedExpenseListSchema = z.array(unifiedExpenseSchema);

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

