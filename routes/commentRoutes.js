const express = require("express");
const {
  addComment,
  deleteComment,
  updateComment,
} = require("../controllers/commentsController");

const router = express.Router();

// POST: Add a new comment to a post
router.post("/:postId", addComment);

// DELETE: Delete a comment by ID
router.delete("/:id", deleteComment);

// PUT: Update a comment by ID
router.put("/:id", updateComment);

module.exports = router;
