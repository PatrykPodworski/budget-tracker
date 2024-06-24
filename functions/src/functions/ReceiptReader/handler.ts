import {
  AzureKeyCredential,
  DocumentAnalysisClient,
  DocumentObjectField,
} from "@azure/ai-form-recognizer";
import { InvocationContext, StorageBlobHandler } from "@azure/functions";
import {
  PrebuiltReceiptDocument,
  PrebuiltReceiptModel,
  ReceiptHotelItemsElement,
  ReceiptItemsElement,
} from "../../prebuilt/prebuilt-receipt";
import { config } from "../../config";

let invocationContext: InvocationContext;

const handler: StorageBlobHandler = async (blob, context) => {
  invocationContext = context;
  const client = new DocumentAnalysisClient(
    config.DI_ENDPOINT,
    new AzureKeyCredential(config.DI_KEY)
  );

  if (!Buffer.isBuffer(blob)) {
    invocationContext.log("Blob is not a buffer");
    return;
  }

  const poller = await client.beginAnalyzeDocument(PrebuiltReceiptModel, blob);
  const {
    documents: [document],
  } = await poller.pollUntilDone();

  if (!document) {
    invocationContext.log("No document found");
    return;
  }
  const blobName = getBlobName();
  const data = mapToReceiptData(document, blobName);

  return data;
};

const mapToReceiptData = (
  { fields }: PrebuiltReceiptDocument,
  fileName: string
): ReceiptData => {
  const items =
    fields.items?.values
      .map(mapToReadProduct)
      .filter((item): item is Item => !!item) ?? [];

  invocationContext.log(
    "counted sum",
    items.reduce(
      (acc, item) => acc + (item.quantity ?? 0) * (item.price ?? 0),
      0
    )
  );

  const transactionTime =
    "transactionTime" in fields ? fields.transactionTime?.value : undefined;
  const transactionDate =
    "transactionDate" in fields ? fields.transactionDate?.value : undefined;

  const data: ReceiptData = {
    id: crypto.randomUUID(),
    userId: config.TEMP_USER_ID,
    fileName,
    merchantName: fields.merchantName?.value,
    total: fields.total?.value,
    transactionDate: transactionDate,
    transactionTime: transactionTime,
    items: items,
  };

  return data;
};

type ReceiptData = {
  id: string;
  userId: string;
  fileName: string;
  merchantName?: string;
  total?: number;
  transactionDate?: Date;
  transactionTime?: string;
  items: Item[];
};

type Item = {
  name?: string;
  quantity?: number;
  price?: number;
};

const getBlobName = () => {
  if (!invocationContext.triggerMetadata) {
    throw new Error("No trigger metadata found");
  }

  if (typeof invocationContext.triggerMetadata.blobTrigger !== "string") {
    throw new Error("Blob trigger metadata is not a string");
  }

  return invocationContext.triggerMetadata.blobTrigger;
};

const mapToReadProduct = (
  item:
    | DocumentObjectField<ReceiptItemsElement>
    | DocumentObjectField<ReceiptHotelItemsElement>
): Item | undefined => {
  const { properties } = item;

  //check if properties type has quantity field
  if (!("quantity" in properties)) {
    return {
      name: properties.description?.value,
      quantity: 1,
      price: properties.totalPrice?.value,
    };
  }

  return {
    name: properties.description?.value,
    quantity: properties.quantity?.value,
    price: properties.price?.value,
  };
};

export default handler;
