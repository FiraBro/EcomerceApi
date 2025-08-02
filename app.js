import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import connectDB from "./config/db.js";
import { errorConverter } from "./middlewares/errorConverter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { AppError } from "./utils/AppError.js";
import rateLimiter from "./middlewares/rateLimiter.js";
// Routes
import productRoute from "./routes/productRoutes.js";
import authRouter from "./routes/authRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import favoriteRoute from "./routes/favoriteRoutes.js";
import cartRoute from "./routes/cartRoutes.js";
import heroRoute from "./routes/heroRoutes.js";

// Configure environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Trust proxy for production (if behind Nginx, Load Balancer, etc.)
app.set("trust proxy", 1);

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ======================
// SECURITY MIDDLEWARES
// ======================

// Enable CORS with production configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
  })
);

// Set security HTTP headers
app.use(helmet());

// Rate limiting (100 requests per 15 minutes)
app.use(rateLimiter);

app.get("/", (req, res) => {
  res.send("API is rate-limited");
});
// ======================
// PERFORMANCE MIDDLEWARES
// ======================

// Compress responses
app.use(compression());

// Parse JSON requests (limit to 10kb)
app.use(express.json({ limit: "10kb" }));

// Parse cookies
app.use(cookieParser());

// ======================
// DEVELOPMENT MIDDLEWARES
// ======================

// Logging in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ======================
// STATIC FILES
// ======================

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================
// DATABASE CONNECTION
// ======================

// Connect to MongoDB
connectDB();

// ======================
// ROUTES
// ======================

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/v1/users", authRouter);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/favorites", favoriteRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/hero", heroRoute);

// ======================
// ERROR HANDLING
// ======================

// 404 Handler for undefined routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Convert errors to AppError format
app.use(errorConverter);

// Global error handler
app.use(errorHandler);

// ======================
// EXPORT APP
// ======================

export default app;
