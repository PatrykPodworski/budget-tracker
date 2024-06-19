import { app } from "@azure/functions";
import { config } from "../../config";
import { handler } from "./handler";

app.cosmosDB("DataEnricher", {
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_CONTAINER,
  createLeaseContainerIfNotExists: true,
  handler,
});
