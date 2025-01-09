import { CosmosClient } from "@azure/cosmos";
import { env } from "@/env";
import { enrichedReceiptDataSchema } from "@/models/enriched-receipt-data-schema";
import { ReceiptsList } from "./receipts-list";

// TODO: P1 Move the queryCosmosDb function to lib
// TODO: P1 Show data like the discord bot
// TODO: P2 Allow to update categories
const Home = async () => {
  const receipts = await queryCosmosDb();

  return (
    <main className="m-auto">
      <div className="flex flex-col gap-4 max-w-prose">
        <ReceiptsList receipts={receipts} />
      </div>
    </main>
  );
};

const queryCosmosDb = async () => {
  const client = new CosmosClient({
    endpoint: env.COSMOS_ENDPOINT,
    key: env.COSMOS_KEY,
  });
  const container = client
    .database(env.COSMOS_DATABASE)
    .container(env.COSMOS_CONTAINER);

  const data = await container.items
    .query<unknown>("SELECT * FROM c ORDER BY c._ts DESC OFFSET 0 LIMIT 10")
    .fetchAll();

  const parsed = data.resources.map((item) =>
    enrichedReceiptDataSchema.parse(item)
  );

  return parsed;
};

export default Home;
