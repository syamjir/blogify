const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: {
    type: String,
    required: [true, "A post should have a title"],
  },
  topic: {
    type: String,
    required: [true, "A post should have under a topic"],
  },
  content: {
    type: String,
    required: [true, "A post should have content"],
  },
  image: {
    type: String,
    required: [true, "A post should have an image"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    default: [],
  },
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
  dislikes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    default: [],
  },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
