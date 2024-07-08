import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import { InvocationContext, StorageBlobHandler } from "@azure/functions";
import { PrebuiltReceiptModel } from "../../prebuilt/prebuilt-receipt";
import { config } from "../../config";
import { mapToReceiptData } from "./mapToReceiptData";
import { registerLogger } from "../../utils/logger/registerLogger";
import { getDefaultChannels } from "../../utils/logger/getDefaultChannels";

const { addChannels, log } = registerLogger();

const handler: StorageBlobHandler = async (blob, context) => {
  addChannels(getDefaultChannels(context, "Receipt Reader"));

  const client = new DocumentAnalysisClient(
    config.DI_ENDPOINT,
    new AzureKeyCredential(config.DI_KEY)
  );

  if (!Buffer.isBuffer(blob)) {
    log("Blob is not a buffer");
    return;
  }

  await log("Started reading the document", context);
  const poller = await client.beginAnalyzeDocument(PrebuiltReceiptModel, blob);
  const {
    documents: [document],
  } = await poller.pollUntilDone();
  await log("Document analyzed", context);

  if (!document) {
    await log("No document found");
    return;
  }
  const blobName = getBlobName(context.triggerMetadata);
  const data = mapToReceiptData(document, blobName);

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

export { handler };
