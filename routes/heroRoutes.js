import express from "express";
import { uploadHeroImage } from "../middlewares/upload.js";
import {
  handleHeroImageUpload,
  getHeroImage,
} from "../controllers/heroController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/hero-upload",
  protect,
  admin,
  uploadHeroImage.single("image"),
  handleHeroImageUpload
);
router.get("/hero-image", getHeroImage);
export default router;
