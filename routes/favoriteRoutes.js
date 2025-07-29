import express from "express";
import {
  addFavorite,
  getFavorites,
  removeFavorite,
} from "../controllers/favoriteController.js";
import protect from "../middlewares/authMiddleware.js";
const favoriteRoute = express.Router();

favoriteRoute.use(protect);

favoriteRoute.route("/").get(getFavorites).post(addFavorite);

favoriteRoute.route("/:itemId").delete(removeFavorite);

export default favoriteRoute;
