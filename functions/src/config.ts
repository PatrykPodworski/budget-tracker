const { COSMOS_DATABASE, COSMOS_CONTAINER, DI_ENDPOINT, DI_KEY, TEMP_USER_ID } =
  process.env;

if (
  !COSMOS_DATABASE ||
  !COSMOS_CONTAINER ||
  !DI_ENDPOINT ||
  !DI_KEY ||
  !TEMP_USER_ID
) {
  throw new Error("Missing environment variables");
}

export const config = {
  COSMOS_DATABASE,
  COSMOS_CONTAINER,
  DI_ENDPOINT,
  DI_KEY,
  TEMP_USER_ID,
} as const;
