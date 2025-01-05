import { z } from "zod";
import { enrichedItemSchema } from "../../models/EnrichedReceiptData";

export const assistantResponseSchema = z.object({
  merchantName: z.string().optional(),
  total: z.number().nonnegative(),
  transactionDate: z.string().pipe(z.coerce.date()).optional(),
  items: z.array(enrichedItemSchema),
});

export type AssistantResponse = z.infer<typeof assistantResponseSchema>;
