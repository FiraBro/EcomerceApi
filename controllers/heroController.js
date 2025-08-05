import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const handleHeroImageUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Validate file type (optional but recommended)
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return res
      .status(400)
      .json({ message: "Only JPG, PNG, or WebP images are allowed" });
  }

  const heroDir = path.join(__dirname, "../uploads/hero");
  const newFileName = req.file.filename;

  try {
    await fs.mkdir(heroDir, { recursive: true });
    const files = await fs.readdir(heroDir);

    await Promise.all(
      files.map(async (file) => {
        if (file !== newFileName) {
          try {
            const filePath = path.join(heroDir, file);
            await fs.unlink(filePath);
            console.log(`Deleted old hero image: ${file}`);
          } catch (err) {
            console.error(`Failed to delete ${file}:`, err);
          }
        }
      })
    );

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/hero/${newFileName}`;

    res.status(200).json({
      message: "Hero image uploaded successfully",
      imageUrl,
    });
  } catch (err) {
    console.error("Failed during hero image upload:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// New function to fetch the hero image
export const getHeroImage = async (req, res) => {
  const heroDir = path.join(__dirname, "../uploads/hero");

  try {
    const files = await fs.readdir(heroDir);

    if (files.length === 0) {
      return res.status(404).json({ message: "No hero image found" });
    }

    // Assuming you only keep one hero image (latest uploaded)
    const latestImage = files[0]; // Or sort by timestamp if needed
    const imageUrl = `/uploads/hero/${latestImage}`;

    res.status(200).json({ imageUrl });
  } catch (err) {
    console.error("Error fetching hero image:", err);
    res.status(500).json({ message: "Server error" });
  }
};
