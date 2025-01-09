import { z } from "zod";

const envSchema = z.object({
  COSMOS_ENDPOINT: z.string(),
  COSMOS_KEY: z.string(),
  COSMOS_DATABASE: z.string(),
  COSMOS_CONTAINER: z.string(),
});

export const env = envSchema.parse(process.env);
