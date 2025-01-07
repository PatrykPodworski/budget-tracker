import { app, output } from "@azure/functions";
import { config } from "../config";
import { dataEnricher } from "../lib/data-enricher";

//TODO: P1: Rename functions

const cosmosOutput = output.cosmosDB({
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_ENRICHED_CONTAINER,
});

app.cosmosDB("data-enricher", {
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_RAW_CONTAINER,
  createLeaseContainerIfNotExists: true,
  handler: dataEnricher,
  return: cosmosOutput,
});
