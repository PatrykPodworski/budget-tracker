const {
  COSMOS_DATABASE,
  COSMOS_RAW_CONTAINER,
  COSMOS_ENRICHED_CONTAINER,
  DI_ENDPOINT,
  DI_KEY,
  TEMP_USER_ID,
  OPENAI_ASSISTANT_ID,
  DISCORD_WEBHOOK_ID,
  DISCORD_WEBHOOK_TOKEN,
} = process.env;

if (
  !COSMOS_DATABASE ||
  !COSMOS_RAW_CONTAINER ||
  !COSMOS_ENRICHED_CONTAINER ||
  !DI_ENDPOINT ||
  !DI_KEY ||
  !TEMP_USER_ID ||
  !OPENAI_ASSISTANT_ID ||
  !DISCORD_WEBHOOK_ID ||
  !DISCORD_WEBHOOK_TOKEN
) {
  throw new Error("Missing environment variables");
}

export const config = {
  COSMOS_DATABASE,
  COSMOS_RAW_CONTAINER,
  COSMOS_ENRICHED_CONTAINER,
  DI_ENDPOINT,
  DI_KEY,
  TEMP_USER_ID,
  OPENAI_ASSISTANT_ID,
  DISCORD_WEBHOOK_ID,
  DISCORD_WEBHOOK_TOKEN,
} as const;
