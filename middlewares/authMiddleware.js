const User = require("../models/userModel");

/**
 * Authentication middleware to verify if the user is logged in.
 *
 * Checks if `req.session.userId` exists and corresponds to a valid user in the database.
 * If user is not found or an error occurs, redirects to the login page.
 * Otherwise, calls `next()` to proceed to the next middleware or route handler.
 */

module.exports = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    console.log(userId, "from auth middleware");
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
