import { CosmosClient } from "@azure/cosmos";
import {
  COSMOS_CONTAINER,
  COSMOS_DATABASE,
  COSMOS_ENDPOINT,
  COSMOS_KEY,
} from "./env";

const Home = async () => {
  const client = new CosmosClient({
    endpoint: COSMOS_ENDPOINT,
    key: COSMOS_KEY,
  });
  const container = client
    .database(COSMOS_DATABASE)
    .container(COSMOS_CONTAINER);

  // TODO: P1 Add queried item type and validate with zod
  const data = await container.items
    .query("SELECT * FROM c ORDER BY c._ts DESC OFFSET 0 LIMIT 10")
    .fetchAll();

  console.log(data.resources.length);

  return (
    <main className="m-auto">
      <h1>Budget Tracker</h1>
      <div className="flex flex-col gap-4">
        {data.resources.map((item) => (
          <pre key={item.id} className="max-w-prose text-wrap break-words">
            {JSON.stringify(item)}
          </pre>
        ))}
      </div>
    </main>
  );
};

export default Home;
