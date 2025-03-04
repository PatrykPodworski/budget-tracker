import { app, output, StorageBlobHandler } from "@azure/functions";
import { receiptReader } from "../lib/receipt-reader";
import { config } from "../config";

const cosmosOutput = output.cosmosDB({
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_RAW_CONTAINER,
});

const handler: StorageBlobHandler = async (blob, context) => {
  const receipt = await receiptReader(blob, context);
  // TODO: P-2: Update processing status
  return receipt;
};

app.storageBlob("receipt-reader", {
  path: "receipts/{name}",
  connection: "AzureWebJobsStorage",
  handler: handler,
  return: cosmosOutput,
});
