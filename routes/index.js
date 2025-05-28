const express = require("express");
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const authMiddleware = require("../middlewares/authMiddleware");
const postRoutes = require("./postRoutes");
const accountRoutes = require("./accountRoutes");
const commentRoutes = require("./commentRoutes");
const Post = require("../models/postModel");
const dateFormatter = require("../utils/dateFormatter");

const router = express.Router();

// Home Route
router.get("/app", async (req, res) => {
  try {
    const entries = 4;
    const page = parseInt(req.query.page) || 1;
    const sendMessageError = req.flash("sendMessageError")[0] || "";
    const isUserLogedIn = Boolean(req.session.userId);
    const queryTopic = req.query.topic;
    const isAdmin = req.session.isAdmin;

    if (queryTopic && !isUserLogedIn) {
      return res.redirect("/app/auth/login");
    }

    const userId = req.session.userId;

    // Get latest post
    const latestPost = await Post.findOne()
      .sort({ createdAt: -1 })
      .populate("userId");

    if (!latestPost) {
      console.log("Error retrieving the latest post");
    }

    // Get paginated posts with optional topic filtering
    const queryFilter = queryTopic ? { topic: queryTopic } : {};
    const allPosts = await Post.find(queryFilter)
      .skip((page - 1) * entries)
      .limit(entries)
      .sort({ createdAt: -1 })
      .populate("userId");

    const updatedPosts = allPosts.map((post) => ({
      ...post.toObject(),
      formattedDate: dateFormatter(post.createdAt),
    }));

    const totalPostsCount = await Post.countDocuments(queryFilter);
    const lastPage = Math.ceil(totalPostsCount / entries);

    if (!allPosts.length) {
      console.log("Currently no post available");
    }

    const formattedDate = latestPost
      ? dateFormatter(latestPost.createdAt)
      : null;

    res.render("home", {
      sendMessageError,
      isUserLogedIn,
      userId,
      latestPost,
      formattedDate,
      updatedPosts,
      page,
      lastPage,
      isAdmin,
    });
  } catch (err) {
    console.log("Error loading home page:", err);
    res.status(500).send("An error occurred while loading the page.");
  }
});

// About Route
router.get("/app/about", (req, res) => {
  try {
    res.render("about");
  } catch (err) {
    console.log("Error occurred while rendering about page");
  }
});

// Mount Feature Routes

// Auth routes
router.use("/app/auth", authRoutes);

// Admin panel routes (protected)
router.use("/app/admin", authMiddleware, adminRoutes);

// Post routes (protected)
router.use("/app/posts", authMiddleware, postRoutes);

// Account routes (protected)
router.use("/app/account", authMiddleware, accountRoutes);

// Comment routes
router.use("/app/comments", commentRoutes);

// 404 Not Found Handler
router.use((_, res) => {
  res.render("notFound");
});

module.exports = router;
