import { CosmosDBHandler } from "@azure/functions";
import { receiptRawDataSchema } from "../../models/ReceiptRawData";
import { enrichDocumentWithAssistant } from "./enrichDocumentWithAssistant";
import { mapToEnrichedReceiptData } from "../../models/EnrichedReceiptData";
import { handleMultipleDocuments } from "../../utils/handleMultipleDocuments";
import { registerLogger } from "../../utils/logger/registerLogger";
import { getDefaultChannels } from "../../utils/logger/getDefaultChannels";

export const handler: CosmosDBHandler = async (documents, context) => {
  const { addChannels, info, error, log } = registerLogger();
  try {
    addChannels(getDefaultChannels(context, "Data Enricher"));
    const results = await handleMultipleDocuments(documents, info, log, handle);
    return results;
  } catch (e) {
    error(e);
  }
};

const handle = async (
  document: unknown,
  log: (message: string) => Promise<void>
) => {
  try {
    const parsedDocument = await receiptRawDataSchema.parseAsync(document);
    await log("Sending document to the assistant");
    const response = await enrichDocumentWithAssistant(parsedDocument);
    await log("Document reviewed by the assistant");
    return mapToEnrichedReceiptData(response, parsedDocument);
  } catch (e) {
    throw e;
  }
};
