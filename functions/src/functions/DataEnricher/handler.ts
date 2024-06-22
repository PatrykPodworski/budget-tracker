import { CosmosDBHandler, InvocationContext } from "@azure/functions";
import { receiptRawDataSchema } from "../../models/ReceiptRawData";
import { enrichDocumentWithAssistant } from "./enrichDocumentWithAssistant";
import {
  EnrichedReceiptData,
  mapToEnrichedReceiptData,
} from "./EnrichedReceiptData";

// TODO: Fix the repo
export const handler: CosmosDBHandler = async (documents, context) => {
  try {
    context.info(`Started handling ${documents.length} documents.`);
    let promises: Promise<EnrichedReceiptData>[] = [];
    documents.forEach((document) => {
      promises.push(handle(document, context));
    });
    const results = await Promise.all(promises);
    context.info(`Finished handling ${results.length} documents.`);
    return results;
  } catch (error) {
    context.error(error);
  }
};

const handle = async (document: unknown, context: InvocationContext) => {
  const parsedDocument = await receiptRawDataSchema.parseAsync(document);
  const response = await enrichDocumentWithAssistant(parsedDocument);
  return mapToEnrichedReceiptData(response, parsedDocument);
};

// TODO: P1 Function with cosmosDBTrigger that reads refined data
// TODO: P2 Groups the data by category, creating the excel formula
// TODO: P3 Validates the total price
// TODO: Send the message to the Discord bot

// TODO: Store validated data in DB
// TODO: Get stored items before sending to the assistant
// TODO: Send to assistant only the items that are not stored yet
