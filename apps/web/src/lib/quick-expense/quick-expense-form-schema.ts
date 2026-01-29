import { z } from "zod";
import { quickExpenseAmountFormSchema } from "./quick-expense-amount-form-schema";

export const quickExpenseFormSchema = quickExpenseAmountFormSchema.extend({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  transactionDate: z.date(),
});

export type QuickExpenseFormData = z.infer<typeof quickExpenseFormSchema>;
