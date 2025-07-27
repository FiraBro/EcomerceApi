// middleware/errorHandler.js
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/AppError.js";

export const errorHandler = (err, req, res, next) => {
  logger.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (err instanceof AppError) {
    return res.status(statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    status: "error",
    message: "Something went very wrong!",
  });
};
