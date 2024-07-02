import { app } from "@azure/functions";
import { config } from "../../config";
import { handler } from "./handler";

app.cosmosDB("DataProcessing", {
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_ENRICHED_CONTAINER,
  createLeaseContainerIfNotExists: true,
  handler,
});
