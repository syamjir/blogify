const User = require("../models/userModel");

module.exports = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    if (!user) {
      console.log("Invalid userId");
      res.redirect("/app/auth/login");
      return;
    }
    next();
  } catch (err) {
    console.log("User is not logged in :", err.message);
    res.redirect("/app/auth/login");
  }
};
