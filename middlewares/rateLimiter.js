import rateLimit from "express-rate-limit";
import { AppError } from "../utils/AppError.js";

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    // Use your AppError here
    next(
      new AppError(
        "Too many requests from this IP, please try again later.",
        429
      )
    );
  },
});

export default rateLimiter;
