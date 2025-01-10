import { env } from "@/env";
import { enrichedReceiptDataSchema } from "@/models/enriched-receipt-data-schema";
import { CosmosClient } from "@azure/cosmos";

const ReceiptPage = async ({ params }: ReceiptPageProps) => {
  const { id } = await params;
  const receiptData = await getReceiptData(id);

  return (
    <div>
      <h1>Receipt {id}</h1>
      <pre>{JSON.stringify(receiptData, null, 2)}</pre>
    </div>
  );
};

type ReceiptPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const getReceiptData = async (id: string) => {
  const client = new CosmosClient({
    endpoint: env.COSMOS_ENDPOINT,
    key: env.COSMOS_KEY,
  });
  const container = client
    .database(env.COSMOS_DATABASE)
    .container(env.COSMOS_CONTAINER);

  const data = await container.items
    .query<unknown>({
      query: "SELECT * FROM c WHERE c.id = @id",
      parameters: [{ name: "@id", value: id }],
    })
    .fetchNext();

  const parsed = data.resources.map((item) =>
    enrichedReceiptDataSchema.parse(item)
  );

  return parsed;
};

export default ReceiptPage;
