"use server";

import { getContainer } from "./common/get-container";
import { processingBundleSchema } from "./common/processing-bundle";

export const getProcessingBundle = async (id: string) => {
  const container = getContainer();
  const data = await container.items
    .query<unknown>({
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [{ name: "@id", value: id }],
    })
    .fetchNext();

  const parsed = data.resources.map((item) =>
    processingBundleSchema.parse(item)
  );
  return parsed[0];
};
