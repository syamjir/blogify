const Post = require("../models/postModel");
const path = require("path");
const fs = require("fs");
const dateFormatter = require("../utils/dateFormatter");
const User = require("../models/userModel");
const Comment = require("../models/commentModel");
const timeAgo = require("../utils/timeAgo");
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../helper/cloudinary");

// to view post
exports.getPost = async (req, res) => {
  try {
    const id = req.params.id;
    const isAdmin = req.session.isAdmin;
    const post = await Post.findById(id).populate("userId");
    if (!post) {
      throw new Error("Post not found!");
    }
    const comments = await Comment.find({ postId: id }).populate("userId");
    console.log(comments);
    const updatedComments = comments.map((comment) => {
      return {
        ...comment.toObject(),
        time: timeAgo(comment.createdAt),
        isOwnComment: String(comment.userId._id) === String(req.session.userId),
      };
    });
    console.log(updatedComments);
    const isUserLogedIn = Boolean(req.session.userId);
    const userId = req.session.userId;
    const sendMessageError = req.flash("sendMessageError")[0] || "";
    const formattedDate = dateFormatter(post?.createdAt);

    res.render("post", {
      postData: post,
      isUserLogedIn,
      sendMessageError,
      userId,
      formattedDate,
      updatedComments,
      isAdmin,
    });
  } catch (err) {
    console.log("Error occured while viewing post:", err);
    res.redirect("/app");
  }
};

// to create post
exports.createPost = async (req, res) => {
  try {
    
    const filePath = req.file.path;
    const fileName = req.file.filename;
    const imageUrl = await uploadToCloudinary(fileName, filePath);
    // Delete the file from local filesystem
    fs.unlinkSync(filePath);
    req.body.image = imageUrl;
    req.body.userId = req.session.userId;
    await Post.create(req.body);
    res.redirect("/app");
  } catch (err) {
    // Delete file in case of upload error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.log("Error occured while create post:", err);
    res.redirect(`/app/account/${req.session.userId}`);
  }
};
// delete post
exports.deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findByIdAndDelete(id);
    const result = await deleteFromCloudinary(post.image);
    console.log("post deleted successfully");
    res.redirect(`/app/account/${req.session.userId}`);
  } catch (err) {
    console.log("Error occurred while deleting post:", err);
    res.redirect("/app");
  }
};

// edit post
exports.editPost = async (req, res) => {
  try {
    const id = req.params.id;
    const postData = await Post.findById(id);
    if (!postData) {
      throw new Error("Post not found!");
    }
    const userData = await User.findById(req.session.userId);
    if (!userData) {
      throw new Error("Not loged in!");
    }
    res.render("edit", { postData, userData });
  } catch (err) {
    console.log("Error occured while viewing edit page:", err);
    res.redirect("/app");
  }
};

// update post
exports.updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const image = req.file;

    if (image) {
      const filePath = req.file.path;
      const fileName = req.file.filename;
      const imageUrl = await uploadToCloudinary(fileName, filePath);
      // Delete the file from local filesystem
      fs.unlinkSync(filePath);
      req.body.image = imageUrl;
      
    }
    const updatedPost = await Post.findByIdAndUpdate(id, req.body);
    if (!updatedPost) {
      console.log("Post update error: Post not found");
      return res.redirect(`/app/account/${req.session.userId}`);
    }
    console.log("Update post successfully");
    res.redirect("/app");
  } catch (err) {
    console.error("Error occurred while updating post:", err);
    // Delete file in case of upload error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.redirect(`/app/account/${req.session.userId}`);
  }
};

exports.addLike = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const userId = req.session.userId;
    const post = await Post.findById(id);
    if (post.dislikes.includes(userId)) {
      await Post.findByIdAndUpdate(id, { $pull: { dislikes: userId } });
    }
    if (!post.likes.includes(userId)) {
      const updatePost = await Post.findByIdAndUpdate(
        id,
        {
          $push: { likes: userId },
        },
        { new: true }
      );
      console.log("Successfully added like");
      res.status(200).json(updatePost);
    } else {
      console.log("Already liked the post");
      // res.redirect("/app");
    }
  } catch (err) {
    console.log("Error occured while add like to post:", err);
    // res.redirect(`/app`);
  }
};

exports.addDislike = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.session.userId;
    const post = await Post.findById(id);
    if (post.likes.includes(userId)) {
      await Post.findByIdAndUpdate(id, { $pull: { likes: userId } });
    }
    if (!post.dislikes.includes(userId)) {
      const updatePost = await Post.findByIdAndUpdate(
        id,
        {
          $push: { dislikes: userId },
        },
        { new: true }
      );
      console.log("successfull dislike");
      res.status(200).json(updatePost);
    } else {
      console.log("Already dislike the post");
      res.redirect(`/app`);
    }
  } catch (err) {
    console.error("Error occurred while adding dislike to post:", err);
    res.redirect(`/app`);
  }
};
