import { ItemDefinition, QueryIterator } from "@azure/cosmos";
import { getReceiptContainer } from "../lib/receipt-data/common/get-receipt-container";
import { env } from "@/env";

type ReceiptDocument = ItemDefinition & {
  id: string;
  userId: string;
};

/**
 * Migration script that adds paidBy field to all receipt documents
 * and sets it to 100% paid by the current user (TEMP_USER_ID).
 */
export const addPaidBy = async () => {
  console.log("Starting migration: Adding paidBy field to all receipts...");
  const container = getReceiptContainer();
  let totalDocuments = 0;

  const queryIterator: QueryIterator<ReceiptDocument> = container.items.query(
    {
      query: "SELECT * FROM c WHERE NOT IS_DEFINED(c.paidBy)",
    },
    {
      maxItemCount: 100,
    }
  );

  while (queryIterator.hasMoreResults()) {
    try {
      const { resources } = await queryIterator.fetchNext();

      if (resources.length === 0) {
        console.log("No more documents to process.");
        break;
      }

      console.log(`Processing ${resources.length} documents...`);

      for (const receipt of resources) {
        try {
          const { id, userId } = receipt;

          await container.item(id, userId).patch({
            operations: [
              {
                op: "add",
                path: "/paidBy",
                value: [
                  {
                    personId: env.TEMP_USER_ID,
                    sharePercentage: 100,
                  },
                ],
              },
            ],
          });

          totalDocuments++;

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
