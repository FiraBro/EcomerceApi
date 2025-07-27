// utils/logger.js
import { createLogger, transports, format } from "winston";

export const logger = createLogger({
  level: "error",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: "logs/error.log" }),
    new transports.Console(),
  ],
});
