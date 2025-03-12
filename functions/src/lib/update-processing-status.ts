import { PatchOperation, CosmosClient } from "@azure/cosmos";
import { config } from "../config";

export const updateProcessingStatus = async (
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

type ProcessingStatus = ProcessingSuccessStatus | ProcessingErrorStatus;

type ProcessingSuccessStatus = {
  status: "uploaded" | "read" | "enriched";
};

type ProcessingErrorStatus = {
  status: "error";
  message: string;
};

type ReceiptsStatusData = {
  id: string;
  userId: string;
  processingStatusId: string;
};
