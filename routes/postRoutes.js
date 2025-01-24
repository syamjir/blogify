const express = require("express");
const {
  getPost,
  createPost,
  deletePost,
  editPost,
  updatePost,
  addLike,
  addDislike,
} = require("../controllers/postController");
const router = express.Router();

// Show post
router.get("/:id", getPost);

// show edit
router.get("/:id/edit", editPost);

// Create post
router.post("/new", createPost);

// update post
router.post("/:id", updatePost);

// Delete post
router.delete("/:id", deletePost);

// add like
router.post("/:id/like", addLike);

// add dislike
router.post("/:id/dislike", addDislike);

module.exports = router;
