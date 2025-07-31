import express from "express";
import { uploadHeroImage } from "../middlewares/upload.js";
import { handleHeroImageUpload } from "../controllers/heroController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/hero-upload",
  protect,
  admin,
  uploadHeroImage.single("image"),
  handleHeroImageUpload
);

export default router;
