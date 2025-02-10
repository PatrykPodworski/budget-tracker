import { CosmosDBHandler } from "@azure/functions";
import { handleMultipleDocuments } from "../../utils/handleMultipleDocuments";
import { getWebhookClient } from "../../utils/getWebhookClient";
import { registerLogger } from "../../utils/logger/registerLogger";
import { getDefaultChannels } from "../../utils/logger/getDefaultChannels";
import { enrichedReceiptDataSchema } from "../../models/enriched-receipt-data-schema";
import { config } from "../../config";

// TODO: P1 Clean up the code

// TODO: P2 Automate the deployment process
// TODO: P2 Unify the config
// TODO: P2 Inform about the processing progress via the webhook
// TODO: P2 Improve the logging

// TODO: P3 Absolute import paths

export const dataProcessing: CosmosDBHandler = async (documents, context) => {
  const { addChannels, info, log } = registerLogger();
  addChannels(getDefaultChannels(context, "Data Processor"));
  try {
    await handleMultipleDocuments(documents, info, log, handle);
  } catch (error) {
    context.error(error);
  }
};

const handle = async (document: unknown) => {
  const receiptData = await enrichedReceiptDataSchema.parseAsync(document);

  await revalidateReceiptList();

  await sendLinkToReceipt(receiptData.merchantName, receiptData.id);
};

const revalidateReceiptList = async () => {
  const revalidateUrl = `${config.WEB_BASE_URL}/revalidate?secret=${config.REVALIDATE_SECRET}`;
  await fetch(revalidateUrl);
};

const sendLinkToReceipt = async (
  merchantName: string | undefined,
  id: string
) => {
  const client = getWebhookClient();

  const url = `${config.WEB_BASE_URL}/receipts/${id}`;
  const content = `Receipt from ${merchantName} processed. [View](${url})`;

  await client.send({
    username: "Receipt Assistant",
    content: content,
  });
};
