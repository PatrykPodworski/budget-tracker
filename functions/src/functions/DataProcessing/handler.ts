import { CosmosDBHandler } from "@azure/functions";
import { handleMultipleDocuments } from "../../utils/handleMultipleDocuments";
import { getWebhookClient } from "../../utils/getWebhookClient";
import { registerLogger } from "../../utils/logger/registerLogger";
import { getDefaultChannels } from "../../utils/logger/getDefaultChannels";
import {
  EnrichedItem,
  enrichedReceiptDataSchema,
} from "../../models/EnrichedReceiptData";
import { formatGeneralSection } from "./formatters/formatGeneralSection";
import { formatCategoriesSection } from "./formatters/formatCategoriesSection";
import { formatFormulasSection } from "./formatters/formatFormulasSection";
import { ContentData } from "./ContentData";

const WEBHOOK_MESSAGE_MAX_LENGTH = 2000;

// TODO: P1: Deploy the functions
// TODO: P1: Improve discount handling

// TODO: P2 Inform about the processing progress via the webhook
// TODO: P2 Improve the logging

// TODO: P3 Absolute import paths

export const handler: CosmosDBHandler = async (documents, context) => {
  const { addChannels, info, log } = registerLogger();
  addChannels(getDefaultChannels(context, "Data Processor"));
  try {
    await handleMultipleDocuments(documents, info, log, handle);
  } catch (error) {
    context.error(error);
  }
};

const handle = async (document: unknown) => {
  const receiptData = await enrichedReceiptDataSchema.parseAsync(document);

  const grouped = groupItemsByCategory(receiptData.items);
  const excelFormulas = createExcelFormulas(grouped);
  const countedTotal = getCountedTotal(receiptData.items);
  const totalDifference = getTotalDifference(receiptData.total, countedTotal);

  await sendToWebhook({
    categories: grouped,
    formulas: excelFormulas,
    countedTotal: countedTotal,
    total: receiptData.total,
    totalDifference: totalDifference,
    dateOfTransaction: receiptData.transactionDate?.toLocaleString(),
    merchantName: receiptData.merchantName,
  });
};

const groupItemsByCategory = (items: EnrichedItem[]) => {
  const grouped = items.reduce((acc: Record<string, EnrichedItem[]>, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    acc[item.category].push(item);
    return acc;
  }, {});

  return grouped;
};

const createExcelFormulas = (grouped: Record<string, EnrichedItem[]>) => {
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

const getCountedTotal = (items: EnrichedItem[]) =>
  items.reduce((acc, item) => acc + item.totalPrice * 100, 0) / 100;

const getTotalDifference = (total: number, countedTotal: number) =>
  Math.abs((total * 100 - countedTotal * 100) / 100);

const sendToWebhook = async (data: ContentData) => {
  const generalSection = formatGeneralSection(data);
  const categoriesSection = formatCategoriesSection(data.categories);
  const formulasSection = formatFormulasSection(data.formulas);

  // Validate if the message is too large
  const totalLength =
    generalSection.length + categoriesSection.length + formulasSection.length;
  const isMessageTooLarge = totalLength > WEBHOOK_MESSAGE_MAX_LENGTH;

  if (isMessageTooLarge) {
    await sendSplitMessage(generalSection, categoriesSection, formulasSection);
    return;
  }

  await sendSingleMessage(generalSection, categoriesSection, formulasSection);
};

const sendSingleMessage = async (
  generalSection: string,
  categoriesSection: string,
  formulasSection: string
) => {
  const client = getWebhookClient();

  const content = `# Shopping Receipt
${generalSection}
${categoriesSection}
${formulasSection}`;

  await client.send({
    username: "Receipt Assistant",
    content: content,
  });
};

const sendSplitMessage = async (
  generalSection: string,
  categoriesSection: string,
  formulasSection: string
) => {
  const client = getWebhookClient();

  await Promise.all([
    client.send({
      username: "Receipt Assistant",
      content: `# Shopping Receipt 1/3
        ${generalSection}
        `,
    }),
    client.send({
      username: "Receipt Assistant",
      content: `# Shopping Receipt 2/3
        ${categoriesSection}
        `,
    }),
    client.send({
      username: "Receipt Assistant",
      content: `# Shopping Receipt 3/3
        ${formulasSection}
        `,
    }),
  ]);
};
