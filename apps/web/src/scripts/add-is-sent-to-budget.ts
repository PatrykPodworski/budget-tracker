import { ItemDefinition, QueryIterator } from "@azure/cosmos";
import { getReceiptContainer } from "../lib/receipt-data/common/get-receipt-container";

type ReceiptDocument = ItemDefinition & {
  id: string;
  userId: string;
};

/**
 * Migration script that adds isSentToBudget flag to all receipt documents
 * and sets it to true. Processes documents individually for simplicity.
 */
export const addIsSentToBudget = async () => {
  console.log(
    "Starting migration: Adding isSentToBudget flag to all receipts..."
  );
  const container = getReceiptContainer();
  let totalDocuments = 0;

  // Create query iterator to fetch documents without isSentToBudget flag
  const queryIterator: QueryIterator<ReceiptDocument> = container.items.query(
    {
      query: "SELECT * FROM c WHERE NOT IS_DEFINED(c.isSentToBudget)",
    },
    {
      maxItemCount: 100,
    }
  );

  // Process documents until no more results
  while (queryIterator.hasMoreResults()) {
    try {
      const { resources } = await queryIterator.fetchNext();

      if (resources.length === 0) {
        console.log("No more documents to process.");
        break;
      }

      console.log(`Processing ${resources.length} documents...`);

      // Update each document individually
      for (const receipt of resources) {
        try {
          const { id, userId } = receipt;

          // Patch the document to add the flag
          await container.item(id, userId).patch({
            operations: [
              {
                op: "add",
                path: "/isSentToBudget",
                value: true,
              },
            ],
          });

          totalDocuments++;

          // Log progress every 10 documents
          if (totalDocuments % 10 === 0) {
            console.log(`Processed ${totalDocuments} documents so far`);
          }
        } catch (error) {
          console.error(
            `Failed to update document ${receipt.id}: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }
    } catch (error) {
      console.error(
        `Error fetching documents: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  console.log(
    `Migration completed. Processed a total of ${totalDocuments} documents.`
  );
};
