import { z } from "zod";
import { paymentParticipantSchema } from "@budget-tracker/shared/payment-participant-schema";
import { currencySchema } from "@budget-tracker/shared/currency";

// TODO: P2 Reuse in receipt form schema
export const quickExpenseAmountFormSchema = z.object({
  total: z.number().min(0, "Amount must be 0 or greater"),
  currency: currencySchema,
  paidBy: z
    .array(paymentParticipantSchema)
    .min(1, "At least one person must be assigned"),
});

export type QuickExpenseAmountFormData = z.infer<
  typeof quickExpenseAmountFormSchema
>;
