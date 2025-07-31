// routes/productRoutes.js
import express from "express";
import { uploadProductImage } from "../middlewares/upload.js";
import {
  createProduct,
  searchProducts,
} from "../controllers/productController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const productRoute = express.Router();

productRoute.post(
  "/add",
  protect,
  admin,
  uploadProductImage.single("image"),
  createProduct
);
productRoute.get("/search", searchProducts);
export default productRoute;
