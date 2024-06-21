import { app, output } from "@azure/functions";
import { config } from "../../config";
import { handler } from "./handler";

const cosmosOutput = output.cosmosDB({
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_ENRICHED_CONTAINER,
});

app.cosmosDB("DataEnricher", {
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_RAW_CONTAINER,
  createLeaseContainerIfNotExists: true,
  handler,
  return: cosmosOutput,
});
