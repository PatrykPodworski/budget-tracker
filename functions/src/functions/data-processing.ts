import { app } from "@azure/functions";
import { config } from "../config";
import { dataProcessing } from "../lib/data-processing";

app.cosmosDB("data-processing", {
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_ENRICHED_CONTAINER,
  createLeaseContainerIfNotExists: true,
  handler: dataProcessing,
});
