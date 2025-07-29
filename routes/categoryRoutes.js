// routes/categoryRoutes.js
import express from "express";
import { createCategory } from "../controllers/categoryController.js";
import { getProductsByCategory } from "../controllers/productController.js";

const categoryRoute = express.Router();

categoryRoute.post("/", createCategory);
categoryRoute.get("/:categoryId/products", getProductsByCategory);

export default categoryRoute;
