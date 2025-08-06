// controllers/productController.js
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import catchAsync from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createProduct = catchAsync(async (req, res, next) => {
  const { title, description, price, categoryId } = req.body;

  if (!req.file) {
    return next(new AppError("Image is required", 400));
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  // Resize image to 400px wide
  const inputPath = req.file.path;
  const ext = path.extname(req.file.filename);
  const resizedName = req.file.filename.replace(ext, `_mobile${ext}`);
  const outputPath = path.join(__dirname, `../uploads/products/${resizedName}`);

  await sharp(inputPath).resize({ width: 400 }).toFile(outputPath);

  // Build URL (assuming you're serving /uploads via static route)
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const imageUrl = `${baseUrl}/uploads/products/${resizedName}`;

  const product = new Product({
    title,
    description,
    price,
    category: categoryId,
    image: imageUrl,
  });

  await product.save();

  res.status(201).json({
    status: "success",
    message: "Product created successfully",
    product,
  });
});

export const getProductsByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  // Optional: validate ObjectId
  if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError("Invalid category ID", 400));
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    return next(new AppError("Category not found", 404));
  }

  const products = await Product.find({ category: categoryId });

  res.status(200).json({
    status: "success",
    results: products.length,
    category: category.name,
    products,
  });
});

export const searchProducts = catchAsync(async (req, res, next) => {
  const search = req.query.search;

  if (!search || search.trim() === "") {
    return next(new AppError("Search query cannot be empty", 400));
  }

  const products = await Product.find({
    title: { $regex: search, $options: "i" },
  });

  if (products.length === 0) {
    return next(new AppError("No products found for your search", 404));
  }

  res.status(200).json({
    status: "success",
    results: products.length,
    products,
  });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  // Optional: validate ObjectId
  if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError("Invalid product ID", 400));
  }

  const product = await Product.findById(productId);

  if (!product) {
    return next(new AppError("Product not found", 404));
  }

  // Delete image from local storage (optional and only if using local)
  if (product.image) {
    const filename = product.image.split("/").pop(); // e.g. 1754396400796_mobile.jpg
    const filePath = path.join(__dirname, `../uploads/products/${filename}`);

    try {
      await fs.unlink(filePath); // Delete file
    } catch (err) {
      console.warn("Image file not found or already deleted:", filePath);
    }
  }

  await product.deleteOne(); // Remove product from DB

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});
