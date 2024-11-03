// middlewares/upload.js
import multer from "multer";
import path from "path";
import crypto from "crypto";

// Konfigurasi storage multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder untuk menyimpan file
  },
  filename: (req, file, cb) => {
    // Hash nama file untuk keunikan
    const hash = crypto.randomBytes(16).toString("hex");
    // Dapatkan ekstensi file asli
    const ext = path.extname(file.originalname);
    // Buat nama file baru dengan hash dan ekstensi asli
    const newFileName = `${hash}${ext}`;
    cb(null, newFileName);
  },
});

// Filter jenis file yang diperbolehkan
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type, only JPEG, PNG, and PDF are allowed!"),
      false
    );
  }
};

// Inisialisasi multer
const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Maksimum ukuran file 5MB
  fileFilter,
});

export default upload;
