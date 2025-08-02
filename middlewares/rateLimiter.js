import rateLimit from "express-rate-limit";
import { AppError } from "../utils/AppError.js";

const productionRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000, // Different limits for prod/dev
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: true, // Only count failed requests (status >= 400)
  skip: (req) => req.ip === process.env.ADMIN_IP, // Skip rate limiting for admin IP
  handler: (req, res, next) => {
    next(
      new AppError(
        `Too many requests from this IP (${req.ip}), please try again in 15 minutes.`,
        429
      )
    );
  },
  keyGenerator: (req) => {
    // Rate limit by API key if available, otherwise by IP
    return req.headers["x-api-key"] || req.ip;
  },
});

export default productionRateLimiter;
