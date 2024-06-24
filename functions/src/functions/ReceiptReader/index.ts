import { app, output } from "@azure/functions";
import handler from "./handler";
import { config } from "../../config";

const cosmosOutput = output.cosmosDB({
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_CONTAINER,
});

app.storageBlob("ReceiptReader", {
  path: "receipts/{name}",
  connection: "AzureWebJobsStorage",
  handler: handler,
  return: cosmosOutput,
});
