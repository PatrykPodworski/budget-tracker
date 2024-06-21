import { CosmosDBHandler, InvocationContext } from "@azure/functions";
import { documentSchema } from "./documentSchema";
import {
  ResponseItem,
  enrichDocumentWithAssistant,
} from "./enrichDocumentWithAssistant";
import { config } from "../../config";

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
  // TODO: P2: Bind documentSchema with ReceiptData
  const parsedDocument = await documentSchema.parseAsync(document);
  const response = await enrichDocumentWithAssistant(parsedDocument);
  return mapToEnrichedReceiptData(response);
};

const mapToEnrichedReceiptData = (
  response: ResponseItem[]
): EnrichedReceiptData => {
  // TODO: P1: Combine with the base data
  return {
    id: crypto.randomUUID(),
    userId: config.TEMP_USER_ID,
    items: response,
  };
};

type EnrichedReceiptData = {
  id: string;
  userId: string;
  items: ResponseItem[];
};

// TODO: Function with cosmosDBTrigger that reads refined data
// TODO: Groups the data by category, creating the excel formula
// TODO: Validates the total price
// TODO: Send the message to the Discord bot
