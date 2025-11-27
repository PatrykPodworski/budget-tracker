import { z } from "zod";

export const paymentParticipantSchema = z.object({
  personId: z.string(),
  sharePercentage: z.number().min(0).max(100),
});

export type PaymentParticipant = z.infer<typeof paymentParticipantSchema>;
