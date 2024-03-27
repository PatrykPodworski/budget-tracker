import { app, InvocationContext } from "@azure/functions";

export async function ReceiptReader(
  blob: Buffer,
  context: InvocationContext
): Promise<void> {
  context.log(
    `Storage blob function processed blob "${context.triggerMetadata.name}" with size ${blob.length} bytes`
  );
}

app.storageBlob("ReceiptReader", {
  path: "receipts/{name}",
  connection: "AzureWebJobsStorage",
  handler: ReceiptReader,
});
