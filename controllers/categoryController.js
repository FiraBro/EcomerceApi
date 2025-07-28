// controllers/categoryController.js
import Category from "../models/Category.js";
import catchAsync from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new AppError("Category name is required", 400));
  }

  // Check for duplicate
  const existing = await Category.findOne({ name: name.toLowerCase() });
  if (existing) {
    return next(new AppError("Category already exists", 400));
  }

  const category = await Category.create({ name: name.toLowerCase() });

  res.status(201).json({
    status: "success",
    message: "Category created successfully",
    category,
  });
});
