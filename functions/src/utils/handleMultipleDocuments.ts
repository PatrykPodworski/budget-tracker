export const handleMultipleDocuments = async (
  documents: unknown[],
  info: (message: string) => void,
  handler: (document: unknown) => Promise<unknown>
) => {
  info(`Started handling ${documents.length} documents.`);
  let promises: Promise<unknown>[] = [];
  documents.forEach((document) => {
    promises.push(handler(document));
  });
  const results = await Promise.all(promises);
  info(`Finished handling ${results.length} documents.`);
  return results;
};
