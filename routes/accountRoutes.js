const express = require("express");
const multerUploader = require("../helper/multer");
const {
  getUserAccount,
  updateUserPhoto,
} = require("../controllers/accountController");

const router = express.Router();

// GET: Show user account by ID
router.get("/:id", getUserAccount);

// POST: Update user profile photo
router.post(
  "/:id/update-user-photo",
  multerUploader().single("image"),
  updateUserPhoto
);

module.exports = router;
