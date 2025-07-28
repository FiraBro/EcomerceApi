// controllers/productController.js
import Product from "../models/Product.js";
import Category from "../models/Category.js";
import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";
import catchAsync from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

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
