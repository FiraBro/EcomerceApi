import Favorite from "../models/Favorite.js";
import Item from "../models/Product.js";
import catchAsync from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

export const addFavorite = catchAsync(async (req, res, next) => {
  const { itemId } = req.body;
  const userId = req.user.id;

  const item = await Item.findById(itemId);
  if (!item) return next(new AppError("Item not found", 404));

  const exists = await Favorite.findOne({ user: userId, item: itemId });
  if (exists) return next(new AppError("Item already in favorites", 400));

  const favorite = await Favorite.create({ user: userId, item: itemId });

  res.status(201).json({
    status: "success",
    data: { favorite },
  });
});

export const getFavorites = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const favorites = await Favorite.find({ user: userId }).populate("item");

  res.status(200).json({
    status: "success",
    results: favorites.length,
    data: { favorites },
  });
});

export const removeFavorite = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user.id;

  const favorite = await Favorite.findOneAndDelete({
    user: userId,
    item: itemId,
  });
  if (!favorite) return next(new AppError("Favorite not found", 404));

  res.status(200).json({
    status: "success",
    message: "Favorite removed",
  });
});
