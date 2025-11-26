import { z } from "zod";
import {
  paymentParticipantSchema,
  type PaymentParticipant,
} from "./payment-participant-schema";
import { currencySchema } from "./currency";

export const quickExpenseSchema = z
  .object({
    id: z.uuid(),
    userId: z.uuid(),
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    amount: z.number().nonnegative(),
    currency: currencySchema,
    amountPLN: z.number().nonnegative(),
    transactionDate: z.coerce.date(),
    paidBy: z
      .array(paymentParticipantSchema)
      .min(1, "At least one person must be assigned"),
    isSentToBudget: z.boolean(),
    createdAt: z.coerce.date(),
  })
  .refine(
    (data) => {
      const sum = data.paidBy.reduce((acc, p) => acc + p.sharePercentage, 0);
      return Math.abs(sum - 100) < 0.01;
    },
    { message: "Share percentages must sum to 100" }
  );

export type QuickExpense = z.infer<typeof quickExpenseSchema>;
