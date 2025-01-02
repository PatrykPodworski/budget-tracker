import { Client, Events, GatewayIntentBits } from "discord.js";
import { config } from "./config";
import getReceiptImages from "./getReceiptImages";
import uploadImages from "./uploadImages";
import { initializeServer } from "./initializeServer";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  const images = await getReceiptImages(message);
  await uploadImages(images);
});

client.login(config.DISCORD_TOKEN);

initializeServer();

// TODO: P1: Add health check endpoint
// TODO: P2: Fix the exports
// TODO: P3 Update eslint
