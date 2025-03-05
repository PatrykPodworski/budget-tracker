import { z } from "zod";

// TODO: P1 Use monorepo and share this schema with other projects
export const enrichedItemSchema = z.object({
  originalName: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  unitPrice: z.number().nonnegative(),
  quantity: z.number().nonnegative(),
  totalPrice: z.number().nonnegative(),
  discount: z.number().nonnegative(),
});

export type EnrichedItem = z.infer<typeof enrichedItemSchema>;
