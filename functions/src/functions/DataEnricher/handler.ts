import { CosmosDBHandler } from "@azure/functions";
import { receiptRawDataSchema } from "../../models/ReceiptRawData";
import { enrichDocumentWithAssistant } from "./enrichDocumentWithAssistant";
import { mapToEnrichedReceiptData } from "../../models/EnrichedReceiptData";
import { handleMultipleDocuments } from "../../utils/handleMultipleDocuments";
import { registerLogger } from "../../utils/logger/registerLogger";
import { getDefaultChannels } from "../../utils/logger/getDefaultChannels";

const { addChannels, info, error, log } = registerLogger();

export const handler: CosmosDBHandler = async (documents, context) => {
  try {
    addChannels(getDefaultChannels(context, "Data Enricher"));
    const results = await handleMultipleDocuments(documents, info, handle);
    return results;
  } catch (e) {
    error(e);
  }
};

const handle = async (document: unknown) => {
  try {
    const parsedDocument = await receiptRawDataSchema.parseAsync(document);
    log("Sending document to the assistant");
    const response = await enrichDocumentWithAssistant(parsedDocument);
    log("Document reviewed by the assistant");
    return mapToEnrichedReceiptData(response, parsedDocument);
  } catch (e) {
    error(e);
  }
};
