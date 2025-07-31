import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const handleHeroImageUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const heroDir = path.join(__dirname, "../uploads/hero");
  const newFileName = req.file.filename;

  try {
    // Read all existing files in uploads/hero
    const files = await fs.promises.readdir(heroDir);

    // Delete every file except the newly uploaded one
    await Promise.all(
      files.map(async (file) => {
        if (file !== newFileName) {
          const filePath = path.join(heroDir, file);
          await fs.promises.unlink(filePath);
          console.log(`Deleted old hero image: ${file}`);
        }
      })
    );

    const imageUrl = `/uploads/hero/${newFileName}`; // Frontend-accessible URL

    res.status(200).json({
      message: "Hero image uploaded successfully",
      imageUrl,
    });
  } catch (err) {
    console.error("Failed during hero image upload:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
