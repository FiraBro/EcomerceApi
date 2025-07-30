import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

export const protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new AppError("Not authorized, token missing", 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");
  if (!user) {
    return next(new AppError("User not found", 401));
  }

  req.user = user;
  next();
});

export const admin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return next(new AppError("Access denied. Admins only.", 403));
  }

  next();
};
