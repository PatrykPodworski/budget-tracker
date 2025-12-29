import { z } from "zod";
import { enrichedItemSchema } from "@budget-tracker/shared/enriched-item-schema";
import { normalizeTransactionDate } from "./normalize-transaction-date";

export const assistantResponseSchema = z.object({
  merchantName: z.string().optional(),
  total: z.number().nonnegative(),
  transactionDate: z
    .preprocess((value) => normalizeTransactionDate(value), z.date())
    .optional(),
  items: z.array(enrichedItemSchema),
});

export type AssistantResponse = z.infer<typeof assistantResponseSchema>;
