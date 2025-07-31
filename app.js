import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import { errorConverter } from "./middlewares/errorConverter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import productRoute from "./routes/productRoutes.js";
import authRouter from "./routes/authRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import favoriteRoute from "./routes/favoriteRoutes.js";
import cartRoute from "./routes/cartRoutes.js";
import heroRoute from "./routes/heroRoutes.js";
// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// ✅ Serve static files from /uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// API Routes
app.use("/api/v1/users", authRouter);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/favorites", favoriteRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/hero", heroRoute);

// Error handling middleware
app.use(errorConverter);
app.use(errorHandler);

export default app;
