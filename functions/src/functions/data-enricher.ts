import { app, output } from "@azure/functions";
import { config } from "../config";
import { dataEnricher } from "../lib/data-enricher";
import { CosmosClient, PatchOperation } from "@azure/cosmos";

//TODO: P1: Rename functions
//TODO: P0: Cleanup
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

    await updateProcessingStatus(receipts, "enriched");
    return receipts;
  },
});

const updateProcessingStatus = async (
  receipts: ReceiptsStatusData[],
  status: ProcessingStatus
) => {
  const container = getProcessingContainer();

  // group receipts by processingStatusId
  const groupedReceipts = receipts.reduce<Record<string, ReceiptsStatusData[]>>(
    (acc, x) => {
      if (!acc[x.processingStatusId]) {
        acc[x.processingStatusId] = [];
      }

      acc[x.processingStatusId].push(x);

      return acc;
    },
    {}
  );

  // update each processingStatus in parallel
  const promises = Object.entries(groupedReceipts).map(
    ([processingStatusId, receipts]) => {
      const operations: PatchOperation[] = receipts.map((x) => ({
        op: "replace",
        path: `/receipts/${x.id}`,
        value: status,
      }));

      const partitionKey = receipts[0].userId;
      return container.item(processingStatusId, partitionKey).patch(operations);
    }
  );

  await Promise.all(promises);
};

const getProcessingContainer = () => {
  const client = new CosmosClient({
    endpoint: config.COSMOS_ENDPOINT,
    key: config.COSMOS_KEY,
  });

  return client
    .database(config.COSMOS_DATABASE)
    .container(config.COSMOS_PROCESSING_BUNDLE_CONTAINER);
};

type ProcessingStatus = "uploaded" | "read" | "enriched";

type ReceiptsStatusData = {
  id: string;
  userId: string;
  processingStatusId: string;
};
