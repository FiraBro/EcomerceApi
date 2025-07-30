import express from "express";
import {
  addToCart,
  removeFromCart,
  updateCart,
  getCart
} from "../controllers/cartController.js";
import protect from "../middlewares/protect.js"; // assumes authentication middleware

const router = express.Router();

// All cart routes are protected
router.use(protect);

router.post("/add", addToCart);
router.delete("/remove", removeFromCart);
router.patch("/update", updateCart);
router.patch("/", getCart);


export default router;
