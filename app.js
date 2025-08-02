import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";

import connectDB from "./config/db.js";
import { errorConverter } from "./middlewares/errorConverter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { AppError } from "./utils/AppError.js";

// Routes
import productRoute from "./routes/productRoutes.js";
import authRouter from "./routes/authRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import favoriteRoute from "./routes/favoriteRoutes.js";
import cartRoute from "./routes/cartRoutes.js";
import heroRoute from "./routes/heroRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
connectDB();

const app = express();

app.set("trust proxy", 1);

// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/v1/users", authRouter);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/favorites", favoriteRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/hero", heroRoute);

// Corrected 404 Handler
app.use((req, res, next) => {
  next(new AppError(`Not Found - ${req.method} ${req.originalUrl}`, 404));
});

// Error Middlewares
app.use(errorConverter);
app.use(errorHandler);

export default app;
