const Post = require("../models/postModel");
const path = require("path");

// to view post
exports.getPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id);
    if (!post) {
      throw new Error("Post not found!");
      return;
    }
    res.render("post", { postData: post });
  } catch (err) {
    console.log("Error occured while viewing post:", err);
    res.redirect("/app");
  }
};

// to create post
exports.createPost = async (req, res) => {
  try {
    const image = req.files?.image;
    if (image) {
      const imageName = `${Date.now()}_${image.name}`;
      const imagePath = `/img/${imageName}`;
      await image.mv(path.resolve(__dirname, "..", "public/img", imageName));
      // prepare body for create posr
      req.body.image = imagePath;
    }
    req.body.userId = req.session.userId;
    const createdPost = await Post.create(req.body);
    res.redirect("/app");
  } catch (err) {
    console.log("Error occured while create post:", err);
    res.redirect("/app/posts/new");
  }
};
