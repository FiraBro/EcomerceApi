// middleware/errorConverter.js
import { AppError } from "../utils/AppError.js";

export const errorConverter = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((el) => el.message)
      .join(", ");
    return next(new AppError(message, 400));
  }

  if (err.name === "JsonWebTokenError") {
    return next(new AppError("Invalid token. Please log in again.", 401));
  }

  if (err.name === "TokenExpiredError") {
    return next(new AppError("Your token has expired.", 401));
  }

  next(err);
};
