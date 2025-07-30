import jwt from "jsonwebtoken";
import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";

const protect = catchAsync(async (req, res, next) => {
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

export default protect;
