// multerUploader.js
const multer = require("multer");
const path = require("path");

/**
 * Multer uploader module for handling file uploads.
 *
 * Implements disk storage to save uploaded files locally in the "public/uploads" directory.
 * Each file is saved with a unique name composed of the current timestamp and the original file name.
 *
 * Usage:
 * - Call multerUploader() to get the multer upload middleware configured with this storage.
 */

class Multer {
  uploader() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/uploads"));
      },
      filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
      },
    });

    const upload = multer({ storage });
    return upload;
  }
}

function multerUploader() {
  return new Multer().uploader(); // ✅ call the method
}

module.exports = multerUploader;
