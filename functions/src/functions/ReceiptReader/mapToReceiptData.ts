import { DocumentObjectField } from "@azure/ai-form-recognizer";
import {
  PrebuiltReceiptDocument,
  ReceiptHotelItemsElement,
  ReceiptItemsElement,
} from "../../prebuilt/prebuilt-receipt";
import { config } from "../../config";
import { RawItem, ReceiptRawData } from "../../models/ReceiptRawData";

const mapToReceiptData = (
  { fields }: PrebuiltReceiptDocument,
  fileName: string
): ReceiptRawData => {
  const items = fields.items?.values.map(mapToRawItem) ?? [];

  const transactionDate = parseTransactionDate(fields);

  const data = {
    id: crypto.randomUUID(),
    userId: config.TEMP_USER_ID,
    total: fields.total?.value ?? 0,
    fileName,
    merchantName: fields.merchantName?.value,
    transactionDate: transactionDate,
    items: items,
  };

  return data;
};

const parseTransactionDate = (fields: PrebuiltReceiptDocument["fields"]) => {
  const transactionTime =
    "transactionTime" in fields ? fields.transactionTime?.value : undefined;
  const transactionDate =
    "transactionDate" in fields ? fields.transactionDate?.value : undefined;

  if (!transactionDate) {
    return undefined;
  }

  if (!transactionTime) {
    return transactionDate;
  }

  const [hours, minutes] = transactionTime.split(":");
  transactionDate.setHours(parseInt(hours, 10));
  transactionDate.setMinutes(parseInt(minutes, 10));

  return transactionDate;
};

const mapToRawItem = (
  item:
    | DocumentObjectField<ReceiptItemsElement>
    | DocumentObjectField<ReceiptHotelItemsElement>
): RawItem => {
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

export { mapToReceiptData };
