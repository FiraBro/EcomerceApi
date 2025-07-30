import express from "express";
import {
  addToCart,
  removeFromCart,
  updateCart,
  getCart
} from "../controllers/cartController.js";
import protect from "../middlewares/protect.js"; // assumes authentication middleware

const cartRoute = express.Router();

// All cart routes are protected
cartRoute.use(protect);

cartRoute.post("/add", addToCart);
cartRoute.delete("/remove", removeFromCart);
cartRoute.patch("/update", updateCart);
cartRoute.patch("/", getCart);


export default cartRoute;
