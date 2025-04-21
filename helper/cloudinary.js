// cloudinaryUploader.js

const cloudinary = require("cloudinary").v2;
require("dotenv").config();

class Cloudinary {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  async cloudinaryUploader(fileName, filePath) {
    try {
      const uploadResult = await cloudinary.uploader.upload(filePath, {
        public_id: fileName,
        folder: "blogify",
      });
      return uploadResult.secure_url;
    } catch (error) {
      console.error("Upload failed:", error);
      throw new Error("Cloudinary upload failed");
    }
  }

  extractPublicId(url) {
    const parts = url.split("/");
    const fileNameWithExt = parts.pop();
    return fileNameWithExt;
  }

  async deleteImageFromCloudinary(url) {
    try {
      const publicId = this.extractPublicId(url);
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error("Cloudinary delete error:", error);
      throw error;
    }
  }
}

async function uploadToCloudinary(fileName, filePath) {
  return await new Cloudinary().cloudinaryUploader(fileName, filePath);
}
async function deleteFromCloudinary(url) {
  return await new Cloudinary().deleteImageFromCloudinary(url);
}

module.exports = { uploadToCloudinary, deleteFromCloudinary };
