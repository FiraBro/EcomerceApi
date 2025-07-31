import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
const connectDB = catchAsync(async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
});

export default connectDB;
