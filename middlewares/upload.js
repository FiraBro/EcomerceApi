// middlewares/upload.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createStorage = (folderName) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const dest = path.join(__dirname, `../uploads/${folderName}`);
      fs.mkdirSync(dest, { recursive: true }); // ensure folder exists
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const uniqueName = Date.now() + path.extname(file.originalname);
      cb(null, uniqueName);
    },
  });

export const uploadProductImage = multer({
  storage: createStorage("products"),
});
export const uploadHeroImage = multer({ storage: createStorage("hero") });
