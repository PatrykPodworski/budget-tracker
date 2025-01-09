import { CosmosClient } from "@azure/cosmos";
import { env } from "@/env";

const Home = async () => {
  const client = new CosmosClient({
    endpoint: env.COSMOS_ENDPOINT,
    key: env.COSMOS_KEY,
  });
  const container = client
    .database(env.COSMOS_DATABASE)
    .container(env.COSMOS_CONTAINER);

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
