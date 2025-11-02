import { InvocationContext } from "@azure/functions";
import { Logger } from "./registerLogger";

export const getDefaultChannels = (
  context: InvocationContext,
  name: string
) => {
  const contextLogger = getContextLogger(context, name);
  return [contextLogger];
};

const getContextLogger = (context: InvocationContext, name: string): Logger => {
  return async ({ message, level }) => {
    const messageWithName = `[${name}]: ${message}`;
    return Promise.resolve(context[level ?? "log"](messageWithName));
  };
};
