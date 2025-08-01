// middlewares/rateLimiter.js
import rateLimit from 'express-rate-limit';

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // ⏳ 15 minutes
  max: 100,                 // ✅ Limit each IP to 100 requests per window
  standardHeaders: true,   // ✔️ Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,    // ❌ Disable the `X-RateLimit-*` headers
  message: {
    status: 429,
    message: 'Too many requests, please try again later.',
  },
});

export default apiRateLimiter;
