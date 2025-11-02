import { CosmosDBHandler } from "@azure/functions";
import { registerLogger } from "../../utils/logger/registerLogger";
import { getDefaultChannels } from "../../utils/logger/getDefaultChannels";
import { config } from "../../config";

// TODO: P2 Automate the deployment process
// TODO: P2 Unify the config
// TODO: P2 Improve the logging

// TODO: P3 Absolute import paths

export const dataProcessing: CosmosDBHandler = async (documents, context) => {
  const { addChannels, info } = registerLogger();
  addChannels(getDefaultChannels(context, "Data Processor"));
  try {
    await info("Revalidating receipt list");
    await revalidateReceiptList();
  } catch (error) {
    context.error(error);
  }
};

// TODO: P1 Remove after adding the dynamic receipt fetch
const revalidateReceiptList = async () => {
  const revalidateUrl = `${config.WEB_BASE_URL}/api/revalidate?secret=${config.REVALIDATE_SECRET}`;
  await fetch(revalidateUrl);
};
