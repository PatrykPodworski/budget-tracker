import { z } from "zod";
import { enrichedItemSchema } from "@budget-tracker/shared/enriched-item-schema";
import { paymentParticipantSchema } from "@budget-tracker/shared/payment-participant-schema";

export const receiptFormSchema = z.object({
  merchantName: z.string().optional(),
  transactionDate: z.date().optional(),
  total: z.number(),
  items: z.array(enrichedItemSchema),
  paidBy: z.array(paymentParticipantSchema).min(1),
});

export type ReceiptFormData = z.infer<typeof receiptFormSchema>;
