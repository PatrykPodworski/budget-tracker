import { config } from "../config";
import { WebhookClient } from "discord.js";

export const getWebhookClient = () => {
  return new WebhookClient({
    id: config.DISCORD_WEBHOOK_ID,
    token: config.DISCORD_WEBHOOK_TOKEN,
  });
};
