import { CosmosDBHandler, InvocationContext } from "@azure/functions";
import { handleMultipleDocuments } from "../../utils/handleMultipleDocuments";
import {
  Item,
  enrichedReceiptDataSchema,
} from "../../models/EnrichedReceiptData";
import { config } from "../../config";

export const handler: CosmosDBHandler = async (documents, context) => {
  try {
    await handleMultipleDocuments(documents, context, handle);
  } catch (error) {
    context.error(error);
  }
};
const handle = async (document: unknown, context: InvocationContext) => {
  const receiptData = await enrichedReceiptDataSchema.parseAsync(document);

  const grouped = groupItemsByCategory(receiptData.items);
  const excelFormulas = createExcelFormulas(grouped);
  const doesTotalPriceMatch = validateTotalPrice(
    receiptData.items,
    receiptData.total
  );
  await sendToWebhook(excelFormulas);
};

const groupItemsByCategory = (items: Item[]) => {
  const grouped = items.reduce((acc: Record<string, Item[]>, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    acc[item.category].push(item);
    return acc;
  }, {});

  return grouped;
};

const createExcelFormulas = (grouped: Record<string, Item[]>) => {
  // for each category, create the excel formula
  const excelFormulas = Object.entries(grouped).reduce(
    (acc: Record<string, string>, [category, items]) => {
      acc[category] = `=SUM(${items.map((item) => item.totalPrice).join(",")})`;
      return acc;
    },
    {}
  );

  return excelFormulas;
};

const validateTotalPrice = (items: Item[], total: number) => {
  const totalPrice = items.reduce((acc, item) => acc + item.totalPrice, 0);
  return totalPrice === total;
};

const sendToWebhook = async (formulas: Record<string, string>) => {
  const response = await fetch(config.DISCORD_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: JSON.stringify(formulas) }),
  });

  if (!response.ok) {
    throw new Error("Failed to send to webhook");
  }
};

// TODO: P1 Format the webhook message
// TODO: P2 Include the totals in the message
// TODO: P2 Include items in the message

// TODO: Store validated data in DB
// TODO: Get stored items before sending to the assistant
// TODO: Send to assistant only the items that are not stored yet
