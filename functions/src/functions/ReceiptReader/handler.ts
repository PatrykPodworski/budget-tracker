import {
  AzureKeyCredential,
  DocumentAnalysisClient,
} from "@azure/ai-form-recognizer";
import { InvocationContext, StorageBlobHandler } from "@azure/functions";
import { PrebuiltReceiptModel } from "../../prebuilt/prebuilt-receipt";
import { config } from "../../config";
import { mapToReceiptData } from "./mapToReceiptData";

let invocationContext: InvocationContext;

const handler: StorageBlobHandler = async (blob, context) => {
  invocationContext = context;
  const client = new DocumentAnalysisClient(
    config.DI_ENDPOINT,
    new AzureKeyCredential(config.DI_KEY)
  );

  if (!Buffer.isBuffer(blob)) {
    invocationContext.log("Blob is not a buffer");
    return;
  }

  const poller = await client.beginAnalyzeDocument(PrebuiltReceiptModel, blob);
  const {
    documents: [document],
  } = await poller.pollUntilDone();

  if (!document) {
    invocationContext.log("No document found");
    return;
  }
  const blobName = getBlobName();
  const data = mapToReceiptData(document, blobName);

  return data;
};

const getBlobName = () => {
  if (!invocationContext.triggerMetadata) {
    throw new Error("No trigger metadata found");
  }

  if (typeof invocationContext.triggerMetadata.blobTrigger !== "string") {
    throw new Error("Blob trigger metadata is not a string");
  }

  return invocationContext.triggerMetadata.blobTrigger;
};

export { handler };
