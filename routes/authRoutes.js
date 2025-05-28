const express = require("express");
const {
  login,
  signup,
  userSignup,
  userLogin,
  userLogout,
} = require("../controllers/authController");
console.log(login, signup);

const router = express.Router();

// GET: Render login page
router.get("/login", login);

// POST: Handle user login
router.post("/login", userLogin);

// GET: Render signup page
router.get("/signup", signup);

// POST: Handle user signup
router.post("/signup", userSignup);

// GET: Handle user logout
router.get("/logout", userLogout);

module.exports = router;
