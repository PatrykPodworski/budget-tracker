import { DocumentObjectField } from "@azure/ai-form-recognizer";
import {
  PrebuiltReceiptDocument,
  ReceiptHotelItemsElement,
  ReceiptItemsElement,
} from "../../prebuilt/prebuilt-receipt";
import { config } from "../../config";

const mapToReceiptData = (
  { fields }: PrebuiltReceiptDocument,
  fileName: string
): ReceiptData => {
  const items =
    fields.items?.values
      .map(mapToReadProduct)
      .filter((item): item is Item => !!item) ?? [];

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

const mapToReadProduct = (
  item:
    | DocumentObjectField<ReceiptItemsElement>
    | DocumentObjectField<ReceiptHotelItemsElement>
): Item => {
  const { properties } = item;

  //check if properties type has quantity field
  if (!("quantity" in properties)) {
    return {
      name: properties.description?.value ?? "Unknown Item",
      quantity: 1,
      unitPrice: properties.totalPrice?.value ?? 0,
      totalPrice: properties.totalPrice?.value ?? 0,
    };
  }

  return {
    name: properties.description?.value ?? "Unknown Item",
    quantity: properties.quantity?.value ?? 1,
    unitPrice: properties.price?.value ?? 0,
    totalPrice: properties.totalPrice?.value ?? 0,
  };
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
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export { mapToReceiptData };
