"use server";
import { env } from "@/env";
import { getReceiptContainer } from "./common/get-receipt-container";

// TODO: P3 Delete raw data and image from storage
export const deleteReceiptData = async (id: string) => {
  const partitionKey = env.TEMP_USER_ID;
  const container = getReceiptContainer();

  await container.item(id, partitionKey).delete();
};
