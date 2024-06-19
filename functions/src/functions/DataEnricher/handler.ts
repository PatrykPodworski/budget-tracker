import { CosmosDBHandler, InvocationContext } from "@azure/functions";
import { documentSchema } from "./documentSchema";

// TODO: Fix the repo
export const handler: CosmosDBHandler = async (documents, context) => {
  documents.forEach((document) => {
    handle(document, context);
  });
};

const handle = async (document: unknown, context: InvocationContext) => {
  try {
    const parsedDocument = await documentSchema.parseAsync(document);
    context.log(parsedDocument.items);
    // TODO: Send to the OpenAI API
    // TODO: Store the response
  } catch (error) {
    context.error(error);
  }
};
