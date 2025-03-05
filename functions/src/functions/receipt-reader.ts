import { app, output, StorageBlobHandler } from "@azure/functions";
import { receiptReader } from "../lib/receipt-reader";
import { config } from "../config";
import { updateProcessingStatus } from "../lib/update-processing-status";

const cosmosOutput = output.cosmosDB({
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_RAW_CONTAINER,
});

const handler: StorageBlobHandler = async (blob, context) => {
  const receipt = await receiptReader(blob, context);
  if (!receipt) {
    return;
  }

  await updateProcessingStatus([receipt], { status: "read" });
  return receipt;
};

app.storageBlob("receipt-reader", {
  path: "receipts/{name}",
  connection: "AzureWebJobsStorage",
  handler: handler,
  return: cosmosOutput,
});
