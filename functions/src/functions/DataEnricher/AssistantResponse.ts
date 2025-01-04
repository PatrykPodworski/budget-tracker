import { z } from "zod";

export const assistantResponseSchema = z.object({
  merchantName: z.string().optional(),
  total: z.number().nonnegative(),
  transactionDate: z.string().pipe(z.coerce.date()).optional(),
  items: z.array(
    z.object({
      originalName: z.string().min(1),
      name: z.string().min(1),
      category: z.string().min(1),
      unitPrice: z.number().nonnegative(),
      quantity: z.number().nonnegative(),
      totalPrice: z.number().nonnegative(),
      discount: z.number().nonnegative().optional(),
    })
  ),
});

export type AssistantResponse = z.infer<typeof assistantResponseSchema>;
