// multerUploader.js
const multer = require("multer");
const path = require("path");

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
  return new Multer().uploader(); 
}

module.exports = multerUploader;
