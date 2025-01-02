export const handleMultipleDocuments = async (
  documents: unknown[],
  info: (message: string) => Promise<void>,
  log: (message: string) => Promise<void>,
  handler: (
    document: unknown,
    log: (message: string) => Promise<void>
  ) => Promise<unknown>
) => {
  info(`Started handling ${documents.length} documents.`);
  let promises: Promise<unknown>[] = [];
  documents.forEach((document) => {
    promises.push(handler(document, log));
  });
  const results = await Promise.all(promises);
  info(`Finished handling ${results.length} documents.`);
  return results;
};
