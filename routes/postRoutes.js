const express = require("express");
const multerUploader = require("../helper/multer");
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

// GET: Show a specific post
router.get("/:id", getPost);

// GET: Render edit post page
router.get("/:id/edit", editPost);

// POST: Create a new post with image upload
router.post("/new", multerUploader().single("image"), createPost);

// POST: Update a post by ID with optional image upload
router.post("/:id", multerUploader().single("image"), updatePost);

// DELETE: Delete a post by ID
router.delete("/:id", deletePost);

// POST: Like a post
router.post("/:id/like", addLike);

// POST: Dislike a post
router.post("/:id/dislike", addDislike);

module.exports = router;
