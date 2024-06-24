import { InvocationContext } from "@azure/functions";

export const handleMultipleDocuments = async (
  documents: unknown[],
  context: InvocationContext,
  handler: (document: unknown, context: InvocationContext) => Promise<unknown>
) => {
  context.info(`Started handling ${documents.length} documents.`);
  let promises: Promise<unknown>[] = [];
  documents.forEach((document) => {
    promises.push(handler(document, context));
  });
  const results = await Promise.all(promises);
  context.info(`Finished handling ${results.length} documents.`);
  return results;
};
