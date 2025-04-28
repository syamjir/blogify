const Comment = require("../models/commentModel");
const Post = require("../models/postModel");
const { updateSearchIndex } = require("../models/queryModel");

exports.addComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.session.userId;
    if (!postId || !userId) {
      console.log("Missing post data or user data");
      res.redirect("/app");
    }
    const commentData = {
      content: req.body.content,
      userId,
      postId,
    };
    const comment = await Comment.create(commentData);
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
    res.redirect(`/app/posts/${postId}`);
  } catch (err) {
    console.log("Error occured while adding comment:", err);
    res.redirect("/app");
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const commentId = req.params.id;
    await Post.findOneAndUpdate(
      { comments: commentId },
      { $pull: { comments: commentId } }
    );
    const comment = await Comment.findByIdAndDelete(commentId);
    if (!comment) {
      console.log("Comment is not found");
      res.redirect("/app");
    }
    console.log("Comment deleted successfully:", commentId);
    res.redirect(`/app/account/${req.session.userId}`);
  } catch (err) {
    console.error("Error occurred while deleting comment:", err);
    res.redirect("/app");
  }
};

exports.updateComment = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).send(updatedComment);
  } catch (err) {
    console.log("Error occured while editing comment:", err);
    res.redirect("/app");
  }
};
