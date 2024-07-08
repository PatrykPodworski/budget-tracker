import { InvocationContext } from "@azure/functions";
import { getWebhookClient } from "../getWebhookClient";
import { Logger } from "./registerLogger";

export const getDefaultChannels = (
  context: InvocationContext,
  name: string
) => {
  const contextLogger = getContextLogger(context, name);
  const webhookLogger = getWebhookLogger(name);

  return [contextLogger, webhookLogger];
};

const getContextLogger = (context: InvocationContext, name: string): Logger => {
  return async ({ message, level }) => {
    const messageWithName = `[${name}]: ${message}`;
    return Promise.resolve(context[level ?? "log"](messageWithName));
  };
};

const getWebhookLogger = (name: string): Logger => {
  const logClient = getWebhookClient();

  return async ({ message, level }) => {
    switch (level) {
      case undefined:
      case "log":
        await logClient.send({
          username: name,
          content: message,
        });
        return;
      case "info":
        return;
      case "error":
        await logClient.send({
          username: name,
          content: "Something went wrong",
        });
        return;
      default:
        const _: never = level;
        return;
    }
  };
};
