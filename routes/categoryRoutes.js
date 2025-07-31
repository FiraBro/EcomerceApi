// routes/categoryRoutes.js
import express from "express";
import { createCategory } from "../controllers/categoryController.js";
import { getProductsByCategory } from "../controllers/productController.js";
import { admin, protect } from "../middlewares/authMiddleware.js";

const categoryRoute = express.Router();

categoryRoute.post("/", protect, admin, createCategory);
categoryRoute.get("/:categoryId/products", protect, getProductsByCategory);

export default categoryRoute;
