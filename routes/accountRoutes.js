const express = require("express");
const {
  getUserAccount,
  updateUserPhoto,
} = require("../controllers/accountController");
const upload = require("../middlewares/multer");

const router = express.Router();

// show user account
router.get("/:id", getUserAccount);

// update user photo
router.post("/:id/update-user-photo", updateUserPhoto);

module.exports = router;
