const Query = require("../models/queryModel");
const timeAgo = require("../utils/timeAgo");

exports.sendMessageToAdmin = async (req, res) => {
  try {
    const message = await Query.create({
      ...req.body,
      userId: req.session.userId,
    });
    if (!message) {
      console.log("Failed to create message in the database");
      return res.redirect("/app");
    }
    res.redirect("/app");
  } catch (err) {
    console.log("Error creating message in the database:", err.message);

    req.flash(
      "sendMessageError",
      "Please write your message or log in to the app"
    );
    res.redirect("/app");
  }
};

exports.getAdminPanel = async (req, res) => {
  try {
    if (!req.session.isAdmin) {
      return res.redirect("/login");
    }
    const userId = req.session.userId;
    const allQuery = await Query.find().populate("userId");
    if (!allQuery.length) {
      console.log("There is no query yet");
    }
    const updatedQuery = allQuery.map((query) => {
      return { ...query.toObject(), time: timeAgo(query.createdAt) };
    });
    res.render("admin", { allQuery: updatedQuery, userId });
  } catch (err) {
    console.log("Error occured while opening admin panel");
    res.redirect("/app");
  }
};

// delete query message
exports.deleteQueryMessage = async (req, res) => {
  try {
    const id = req.params.id;
    await Query.findByIdAndDelete(id);
    res.redirect(`/app/admin/${req.session.userId}/admin-panel`);
  } catch (err) {
    console.log("Error occured while deleting query message");
    res.redirect("/app");
  }
};
