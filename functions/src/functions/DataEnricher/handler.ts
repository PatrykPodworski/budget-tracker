import { CosmosDBHandler, InvocationContext } from "@azure/functions";
import { receiptRawDataSchema } from "../../models/ReceiptRawData";
import { enrichDocumentWithAssistant } from "./enrichDocumentWithAssistant";
import {
  EnrichedReceiptData,
  mapToEnrichedReceiptData,
} from "./EnrichedReceiptData";
import { handleMultipleDocuments } from "../../utils/handleMultipleDocuments";

// TODO: Fix the repo
export const handler: CosmosDBHandler = async (documents, context) => {
  try {
    const results = await handleMultipleDocuments(documents, context, handle);
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
