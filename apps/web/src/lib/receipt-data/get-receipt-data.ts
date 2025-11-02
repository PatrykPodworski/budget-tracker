"use server";

import { enrichedReceiptDataSchema } from "@/models/enriched-receipt-data-schema";
import { getReceiptContainer } from "./common/get-receipt-container";

export const getReceiptData = async (id: string) => {
  const container = getReceiptContainer();

  const data = await container.items
    .query<unknown>({
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [{ name: "@id", value: id }],
    })
    .fetchNext();

  const parsed = data.resources.map((item) =>
    enrichedReceiptDataSchema.parse(item)
  );

  return parsed[0];
};
