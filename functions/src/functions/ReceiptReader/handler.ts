import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import { InvocationContext, StorageBlobHandler } from "@azure/functions";
import { PrebuiltReceiptModel } from "../../prebuilt/prebuilt-receipt";
import { config } from "../../config";
import { registerLogger } from "../../utils/logger/registerLogger";
import { getDefaultChannels } from "../../utils/logger/getDefaultChannels";
import { ReceiptRawData } from "../../models/ReceiptRawData";

const handler: StorageBlobHandler = async (blob, context) => {
  const { addChannels, log } = registerLogger();

  addChannels(getDefaultChannels(context, "Receipt Reader"));

  const client = new DocumentAnalysisClient(
    config.DI_ENDPOINT,
    new AzureKeyCredential(config.DI_KEY)
  );

  if (!Buffer.isBuffer(blob)) {
    log("Blob is not a buffer");
    return;
  }

  await log("Started reading the document");
  const poller = await client.beginAnalyzeDocument(PrebuiltReceiptModel, blob);
  const {
    documents: [document],
    content,
  } = await poller.pollUntilDone();
  await log("Document analyzed");

  if (!document) {
    await log("No document found");
    return;
  }
  const imageFileName = getBlobName(context.triggerMetadata);
  const data = mapToReceiptData(content, imageFileName);

  return data;
};

const getBlobName = (triggerMetadata: InvocationContext["triggerMetadata"]) => {
  if (!triggerMetadata) {
    throw new Error("No trigger metadata found");
  }

  if (typeof triggerMetadata.blobTrigger !== "string") {
    throw new Error("Blob trigger metadata is not a string");
  }

  return triggerMetadata.blobTrigger;
};

const mapToReceiptData = (content: string, imageFileName: string) => {
  const data: ReceiptRawData = {
    id: crypto.randomUUID(),
    userId: config.TEMP_USER_ID,
    imageFileName,
    content,
  };

  return data;
};

export { handler };
