// middleware/errorHandler.js
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
  // Log error with stack trace if available
  logger.error(err.stack || err.message || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (err instanceof AppError) {
    return res.status(statusCode).json({
      success: false,
      status: err.status,
      message: message,
    });
  }

  res.status(500).json({
    success: false,
    status: "error",
    message: "Something went very wrong!",
  });
};
