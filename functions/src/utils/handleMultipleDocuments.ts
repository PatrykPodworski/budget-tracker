export const handleMultipleDocuments = async <T>(
  documents: unknown[],
  info: (message: string) => Promise<void>,
  log: (message: string) => Promise<void>,
  handler: (
    document: unknown,
    log: (message: string) => Promise<void>
  ) => Promise<T>
) => {
  info(`Started handling ${documents.length} documents.`);
  let promises: Promise<T>[] = [];
  documents.forEach((document) => {
    promises.push(handler(document, log));
  });
  const results = await Promise.all(promises);
  info(`Finished handling ${results.length} documents.`);
  return results;
};
