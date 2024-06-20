import { CosmosDBHandler, InvocationContext } from "@azure/functions";
import { documentSchema } from "./documentSchema";
import { enrichDocumentWithAssistant } from "./enrichDocumentWithAssistant";

// TODO: Fix the repo
export const handler: CosmosDBHandler = async (documents, context) => {
  context.info(`Started handling ${documents.length} documents.`);
  let promises: Promise<void>[] = [];
  documents.forEach((document) => {
    promises.push(handle(document, context));
  });
  await Promise.all(promises);

  context.info(`Finished handling ${documents.length} documents.`);
};

const handle = async (document: unknown, context: InvocationContext) => {
  try {
    const parsedDocument = await documentSchema.parseAsync(document);
    const response = await enrichDocumentWithAssistant(parsedDocument);
    context.log(`Response: ${JSON.stringify(response)}`);
    // TODO: Store the response
  } catch (error) {
    context.error(error);
  }
};

// TODO: Function with cosmosDBTrigger that reads refined data
// TODO: Groups the data by category, creating the excel formula
// TODO: Validates the total price
// TODO: Send the message to the Discord bot
