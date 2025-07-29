// routes/productRoutes.js
import express from "express";
import upload from "../middlewares/upload.js";
import {
  createProduct,
  searchProducts,
} from "../controllers/productController.js";

const productRoute = express.Router();

productRoute.post("/", upload.single("image"), createProduct);
productRoute.get("/search", searchProducts);
export default productRoute;
