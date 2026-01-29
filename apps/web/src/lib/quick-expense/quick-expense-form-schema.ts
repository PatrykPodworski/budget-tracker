import { z } from "zod";
import { paymentParticipantSchema } from "@budget-tracker/shared/payment-participant-schema";
import { currencySchema } from "@budget-tracker/shared/currency";

export const quickExpenseFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  total: z.number().min(0, "Amount must be 0 or greater"),
  currency: currencySchema,
  transactionDate: z.date(),
  paidBy: z
    .array(paymentParticipantSchema)
    .min(1, "At least one person must be assigned"),
});

export type QuickExpenseFormData = z.infer<typeof quickExpenseFormSchema>;
