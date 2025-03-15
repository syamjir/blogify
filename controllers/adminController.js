const Query = require("../models/queryModel");

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
