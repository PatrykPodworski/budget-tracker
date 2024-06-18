import { CosmosDBHandler, app } from "@azure/functions";
import { config } from "../../config";

// TODO: Fix the repo
const handler: CosmosDBHandler = async (documents, context) => {
  documents.forEach((document) => {
    context.log(document);
    // TODO: Typecheck the document
    // TODO: Get the items
    // TODO: Send to the OpenAI API
    // TODO: Store the response
  });
};

app.cosmosDB("DataEnricher", {
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_CONTAINER,
  createLeaseContainerIfNotExists: true,
  handler,
});
