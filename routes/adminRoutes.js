const express = require("express");
const {
  sendMessageToAdmin,
  getAdminPanel,
  deleteQueryMessage,
} = require("../controllers/adminController");

const router = express.Router();
// send message to admin
router.post("/send-message", sendMessageToAdmin);

// view  query message
router.get("/:id/admin-panel", getAdminPanel);

// delete query message
router.delete("/:id", deleteQueryMessage);

module.exports = router;
