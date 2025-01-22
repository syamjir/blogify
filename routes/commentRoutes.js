const express = require("express");
const {
  addComment,
  deleteComment,
  updateComment,
} = require("../controllers/commentsController");

const router = express.Router();

// add comment
router.post("/:postId", addComment);

// delete comment
router.delete("/:id", deleteComment);

// update comment
router.put("/:id", updateComment);

module.exports = router;
