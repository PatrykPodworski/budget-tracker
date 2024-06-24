import { CosmosDBHandler, app } from "@azure/functions";
import { config } from "../../config";

const handler: CosmosDBHandler = async (documents, context) => {
  context.log(`Cosmos DB function processed ${documents.length} documents`);
};

app.cosmosDB("DataEnricher", {
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_CONTAINER,
  createLeaseContainerIfNotExists: true,
  handler,
});
