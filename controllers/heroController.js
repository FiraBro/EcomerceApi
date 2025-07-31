// controllers/heroController.js

export const handleHeroImageUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const imageUrl = `/uploads/hero/${req.file.filename}`;

  res.status(200).json({
    message: "Hero image uploaded successfully",
    imageUrl,
  });
};
