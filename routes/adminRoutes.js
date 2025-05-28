const express = require("express");
const {
  sendMessageToAdmin,
  getAdminPanel,
  deleteQueryMessage,
} = require("../controllers/adminController");

const router = express.Router();

// POST: Send a message to admin
router.post("/send-message", sendMessageToAdmin);

// GET: View query messages in admin panel by ID
router.get("/:id/admin-panel", getAdminPanel);

// DELETE: Delete a query message by ID
router.delete("/:id", deleteQueryMessage);

module.exports = router;
