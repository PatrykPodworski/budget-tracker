import { CosmosDBHandler, InvocationContext } from "@azure/functions";
import { documentSchema } from "./documentSchema";
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
  // TODO: P1: Bind documentSchema with ReceiptData
  const parsedDocument = await documentSchema.parseAsync(document);
  const response = await enrichDocumentWithAssistant(parsedDocument);
  return mapToEnrichedReceiptData(response, parsedDocument);
};

// TODO: P2 Function with cosmosDBTrigger that reads refined data
// TODO: P3 Groups the data by category, creating the excel formula
// TODO: Validates the total price
// TODO: Send the message to the Discord bot
