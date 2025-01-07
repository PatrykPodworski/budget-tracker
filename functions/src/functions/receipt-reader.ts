import { app, output } from "@azure/functions";
import { receiptReader } from "../lib/receipt-reader";
import { config } from "../config";

const cosmosOutput = output.cosmosDB({
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_RAW_CONTAINER,
});

app.storageBlob("receipt-reader", {
  path: "receipts/{name}",
  connection: "AzureWebJobsStorage",
  handler: receiptReader,
  return: cosmosOutput,
});
