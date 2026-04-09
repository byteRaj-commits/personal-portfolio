import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure temp directory exists
const tempDir = "./public/temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png|gif|webp|svg/;
  const allowedDocTypes = /pdf/;

  const ext = path.extname(file.originalname).toLowerCase().replace(".", "");
  const isImage = allowedImageTypes.test(ext);
  const isPDF = allowedDocTypes.test(ext);

  if (file.fieldname === "resume" && isPDF) {
    return cb(null, true);
  }
  if (file.fieldname !== "resume" && isImage) {
    return cb(null, true);
  }

  cb(new Error(`Invalid file type: ${file.mimetype}`), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
});
