import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import HeroImage from "../models/HeroImage.js";
import catchAsync from "../utils/catchAsync.js";
import { AppError } from "../utils/AppError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload and replace hero image
export const handleHeroImageUpload = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("No file uploaded", 400));
  }

  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return next(new AppError("Only JPG, PNG, or WebP images are allowed", 400));
  }

  const heroDir = path.join(__dirname, "../uploads/hero");
  const newFileName = req.file.filename;
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const imageUrl = `${baseUrl}/uploads/hero/${newFileName}`;

  await fs.mkdir(heroDir, { recursive: true });

  const files = await fs.readdir(heroDir);
  await Promise.all(
    files.map(async (file) => {
      if (file !== newFileName) {
        await fs.unlink(path.join(heroDir, file));
      }
    })
  );

  await HeroImage.deleteMany({});

  const newHero = new HeroImage({
    imageUrl,
    filename: newFileName,
  });

  await newHero.save();

  res.status(200).json({
    message: "Hero image uploaded and saved successfully",
    imageUrl,
  });
});

// Get current hero image
export const getHeroImage = catchAsync(async (req, res, next) => {
  const hero = await HeroImage.findOne().sort({ uploadedAt: -1 });

  if (!hero) {
    return next(new AppError("No hero image found", 404));
  }

  res.status(200).json({ imageUrl: hero.imageUrl });
});
