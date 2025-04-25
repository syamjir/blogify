const User = require("../models/userModel");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const timeAgo = require("../utils/timeAgo");
const { uploadToCloudinary } = require("../helper/cloudinary");

exports.getUserAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      console.log("User is not found");
      res.redirect("/app");
    }
    const userPosts = await Post.find({
      userId: req.session.userId,
    });
    const comments = await Comment.find({
      userId: req.session.userId,
    })
      .populate("userId")
      .populate("postId");

    if (!comments) {
      console.log("There are no comment published by this user!");
    }

    const updatedComments = comments.map((comment) => {
      return { ...comment.toObject(), time: timeAgo(comment.updatedAt) };
    });
    console.log(updatedComments);
    if (!userPosts) {
      console.log("There are no posts published by this user!");
    }
    res.render("account", {
      userData: user,
      userPosts,
      comments: updatedComments,
    });
  } catch (err) {
    console.log("Error occurred while retrieving user account:", err);
    res.redirect("/app");
  }
};

exports.updateUserPhoto = async (req, res) => {
  try {
    inputPath = req.file.path;
    const outputFilename = `${Date.now()}-${req.file.filename}`;
    outputPath = path.join(__dirname, "../public/uploads", outputFilename);

    // Resize the image
    await sharp(inputPath).resize(50, 50).toFile(outputPath);

    // Delete original file
    fs.unlinkSync(inputPath);

    // Upload to Cloudinary
    const imageUrl = await uploadToCloudinary(outputFilename, outputPath);

    // Delete resized file
    fs.unlinkSync(outputPath);

    // Update in DB
    const id = req.params.id;
    await User.findByIdAndUpdate(id, { image: imageUrl });

    res.redirect(`/app/account/${id}`);
  } catch (err) {
    console.log("Error occurred during update profile photo:", err);

    // Cleanup files if they exist
    if (inputPath && fs.existsSync(inputPath)) {
      fs.unlinkSync(inputPath);
    }
    if (outputPath && fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }

    res.redirect("/app");
  }
};
