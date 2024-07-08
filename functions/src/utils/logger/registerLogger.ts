export const registerLogger = () => {
  let channels: Logger[] = [];

  const addChannels = (channelsToAdd: Logger[]) => {
    channels.push(...channelsToAdd);
  };

  const logger = async (props: LogProps) => {
    channels.forEach(async (channel) => await channel(props));
  };

  const log = async (message: string) => {
    await logger({ message, level: "log" });
  };

  const error = async (message: unknown) => {
    await logger({ message, level: "error" });
  };

  const info = async (message: string) => {
    await logger({ message, level: "info" });
  };

  return { addChannels, log, error, info, logger };
};

export type Logger = (props: LogProps) => Promise<void>;

export type LogProps =
  | {
      message: string;
      level?: "log" | "info";
    }
  | {
      message: unknown;
      level: "error";
    };
