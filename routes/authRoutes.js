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
//render login page
router.get("/login", login);

// user login
router.post("/login", userLogin);

//render signup page
router.get("/signup", signup);

// user signup
router.post("/signup", userSignup);

// user logouut
router.get("/logout", userLogout);

module.exports = router;
