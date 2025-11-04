import { enrichedReceiptDataSchema } from "@budget-tracker/shared/enriched-receipt-data-schema";
import { getReceiptContainer } from "./common/get-receipt-container";

export const getLatestReceipts = async () => {
  const container = getReceiptContainer();

  const data = await container.items
    .query<unknown>(
      "SELECT * FROM c ORDER BY c.transactionDate DESC OFFSET 0 LIMIT 10"
    )
    .fetchAll();

  const parsed = data.resources.map((item) =>
    enrichedReceiptDataSchema.parse(item)
  );

  return parsed;
};
