import { z } from "zod";
import { enrichedItemSchema } from "./enriched-item-schema";

const paymentParticipantSchema = z.object({
  personId: z.string(),
  sharePercentage: z.number().min(0).max(100),
});

export type PaymentParticipant = z.infer<typeof paymentParticipantSchema>;

export const enrichedReceiptDataSchema = z
  .object({
    id: z.uuid(),
    processingStatusId: z.uuid(),
    userId: z.uuid(),
    total: z.number(),
    merchantName: z.string().optional(),
    transactionDate: z.string().pipe(z.coerce.date()).optional(),
    items: z.array(enrichedItemSchema),
    isSentToBudget: z.boolean(),
    paidBy: z
      .array(paymentParticipantSchema)
      .min(1, "At least one person must be assigned"),
  })
  .refine(
    (data) => {
      const sum = data.paidBy.reduce((acc, p) => acc + p.sharePercentage, 0);
      return Math.abs(sum - 100) < 0.01;
    },
    { message: "Share percentages must sum to 100" }
  );

export type EnrichedReceiptData = z.infer<typeof enrichedReceiptDataSchema>;
