import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { errorConverter } from "./middlewares/errorConverter.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import productRoute from "./routes/productRoutes.js";
import authRouter from "./routes/authRoutes.js";
import categoryRoute from "./routes/categoryRoutes.js";
import favoriteRoute from "./routes/favoriteRoutes.js"; 
const app = express();
app.use(express.json());
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/users", authRouter);
app.use("/api/v1/products", productRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/favorites", favoriteRoute);    

// Error Handler
app.use(errorHandler);

// Error handling middlewares
app.use(errorConverter);
app.use(errorHandler);

export default app;
