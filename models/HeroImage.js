// models/HeroImage.js
import mongoose from "mongoose";

const heroImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    filename: {
      type: String,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const HeroImage = mongoose.model("HeroImage", heroImageSchema);

export default HeroImage;
