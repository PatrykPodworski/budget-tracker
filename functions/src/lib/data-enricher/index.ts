import { InvocationContext } from "@azure/functions";
import { receiptRawDataSchema } from "../../models/receipt-raw-data";
import { enrichDocumentWithAssistant } from "./enrich-document-with-assistant";
import {
  EnrichedReceiptData,
  mapToEnrichedReceiptData,
} from "../../models/enriched-receipt-data-schema";
import { handleMultipleDocuments } from "../../utils/handleMultipleDocuments";
import { registerLogger } from "../../utils/logger/registerLogger";
import { getDefaultChannels } from "../../utils/logger/getDefaultChannels";

// TODO: P2 Remove Azure dependencies
export const dataEnricher = async (
  documents: unknown[],
  context: InvocationContext
) => {
  const { addChannels, info, error, log } = registerLogger();
  try {
    addChannels(getDefaultChannels(context, "Data Enricher"));
    const results = await handleMultipleDocuments(documents, info, log, handle);
    return results;
  } catch (e) {
    error(e);
    throw e;
  }
};

const handle = async (
  document: unknown,
  log: (message: string) => Promise<void>
): Promise<EnrichedReceiptData> => {
  const parsedDocument = await receiptRawDataSchema.parseAsync(document);
  await log("Sending document to the assistant");
  const response = await enrichDocumentWithAssistant(parsedDocument);
  await log("Document reviewed by the assistant");
  const receipt = mapToEnrichedReceiptData(response, parsedDocument);

  return receipt;
};
