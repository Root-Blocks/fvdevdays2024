import pino, { Logger } from "pino";

export const logger: Logger =
  process.env.NEXT_PUBLIC_ENV === "prod"
    ? pino({ level: "warn" })
    : pino({
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
        level: "debug",
      });
