import { createLogger, format, transports } from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

export const baseLogger = createLogger({
  level: "debug",
  transports: [new transports.Console()],
});
