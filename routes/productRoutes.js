// routes/productRoutes.js
import express from "express";
import upload from "../middlewares/upload.js";
import { createProduct } from "../controllers/productController.js";

const productRoute = express.Router();

productRoute.post("/", upload.single("image"), createProduct);
export default productRoute;
