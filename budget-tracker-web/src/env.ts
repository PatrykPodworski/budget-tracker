import { z } from "zod";

const envSchema = z.object({
  REVALIDATE_SECRET: z.string(),

  COSMOS_ENDPOINT: z.string(),
  COSMOS_KEY: z.string(),
  COSMOS_DATABASE: z.string(),
  COSMOS_CONTAINER: z.string(),

  GOOGLE_DOCUMENT_ID: z.string(),
  GOOGLE_SERVICE_ACCOUNT_BASE64: z.string(),
});

export const env = envSchema.parse(process.env);
