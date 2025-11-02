import { env } from "@/env";
import { CosmosClient } from "@azure/cosmos";

export const getContainer = () => {
  const client = new CosmosClient({
    endpoint: env.COSMOS_ENDPOINT,
    key: env.COSMOS_KEY,
  });
  const container = client
    .database(env.COSMOS_DATABASE)
    .container(env.COSMOS_PROCESSING_BUNDLE_CONTAINER);

  return container;
};
