import Favorite from "../models/Favorite.js";
import Product from "../models/Product.js"; // renamed from Item
import catchAsync from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const addFavorite = catchAsync(async (req, res, next) => {
  const { productId } = req.body; // changed from itemId
  const userId = req.user.id;

  const product = await Product.findById(productId); // changed from item
  if (!product) return next(new AppError("Product not found", 404));

  const exists = await Favorite.findOne({ user: userId, product: productId });
  if (exists) return next(new AppError("Product already in favorites", 400));

  const favorite = await Favorite.create({ user: userId, product: productId });

  res.status(201).json({
    status: "success",
    data: { favorite },
  });
});

export const getFavorites = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const favorites = await Favorite.find({ user: userId }).populate("product");

  res.status(200).json({
    status: "success",
    results: favorites.length,
    data: { favorites },
  });
});

export const removeFavorite = catchAsync(async (req, res, next) => {
  const { itemId } = req.params; // or rename to favoriteId for clarity
  const userId = req.user.id;

  const favorite = await Favorite.findOneAndDelete({
    _id: itemId,
    user: userId,
  });

  if (!favorite) return next(new AppError("Favorite not found", 404));

  res.status(200).json({
    status: "success",
    message: "Favorite removed",
  });
});
