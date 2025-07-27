import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRouter from "./routes/authRoutes.js";
import { errorConverter } from "./middlewares/errorConverter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
const app = express();
app.use(express.json());
dotenv.config();
connectDB();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/v1/users", authRouter);
// Error Handler
app.use(errorHandler);

// Error handling middlewares
app.use(errorConverter);
app.use(errorHandler);

export default app;
