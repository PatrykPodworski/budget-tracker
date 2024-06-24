import { CosmosDBHandler, InvocationContext } from "@azure/functions";
import { handleMultipleDocuments } from "../../utils/handleMultipleDocuments";

export const handler: CosmosDBHandler = async (documents, context) => {
  try {
    await handleMultipleDocuments(documents, context, handle);
  } catch (error) {
    context.error(error);
  }
};
const handle = async (document: unknown, context: InvocationContext) => {
  context.log(JSON.stringify(document));
};

// TODO: P1 Validate the document type
// TODO: P2 Groups the data by category
// TODO: P2 Create the excel formula
// TODO: P3 Validates the total price
// TODO: Send the message to the Discord bot

// TODO: Store validated data in DB
// TODO: Get stored items before sending to the assistant
// TODO: Send to assistant only the items that are not stored yet
