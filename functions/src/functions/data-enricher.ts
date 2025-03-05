import { app, output } from "@azure/functions";
import { config } from "../config";
import { dataEnricher } from "../lib/data-enricher";
import { CosmosClient, PatchOperation } from "@azure/cosmos";
import { updateProcessingStatus } from "../lib/update-processing-status";

//TODO: P0 Cleanup
//TODO: P1 Rename functions
//TODO: P1 Add intermediate processing statuses
const receiptOutput = output.cosmosDB({
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_ENRICHED_CONTAINER,
});

app.cosmosDB("data-enricher", {
  connection: "CosmosDbConnection",
  databaseName: config.COSMOS_DATABASE,
  containerName: config.COSMOS_RAW_CONTAINER,
  createLeaseContainerIfNotExists: true,
  return: receiptOutput,
  handler: async (documents, context) => {
    const receipts = await dataEnricher(documents, context);

    await updateProcessingStatus(receipts, { status: "enriched" });
    return receipts;
  },
});
