const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.login = (req, res) => {
  const tempUserData = req.flash("tempUserData") || [];
  const loginError = req.flash("loginError") || "";
  const formattedUserData = Object.assign({}, ...tempUserData);
  res.render("login", { tempUserData: formattedUserData, loginError });
};

// When the user visits the signup page.
exports.signup = (req, res) => {
  const errors = req.flash("validationErrors") || [];
  const tempUserData = req.flash("tempUserData") || [];
  const formattedUserData = Object.assign({}, ...tempUserData);
  const formattedErrors = Object.assign({}, ...errors);
  res.render("signup", {
    validationErrors: formattedErrors,
    tempUserData: formattedUserData,
  });
};

// When the user signs up
exports.userSignup = async (req, res) => {
  try {
    const createdUser = await User.create(req.body);
    console.log(createdUser);
    req.session.userId = createdUser._id;
    req.session.save();
    res.redirect("/app");
  } catch (err) {
    console.log("Signup failure:", err);
    const validationErrors = Object.keys(err.errors).map((key) => {
      return { [err.errors[key].path]: err.errors[key].message };
    });
    console.log(validationErrors);
    req.flash("validationErrors", validationErrors);
    req.flash("tempUserData", req.body);
    res.redirect("/app/auth/signup");
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Please provide both email and password.");
    }
    const registeredUser = await User.findOne({ email });
    if (!registeredUser) {
      throw new Error("This email is not registered.");
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      registeredUser.password
    );
    if (!isPasswordCorrect) {
      throw new Error("Incorrect password. Please try again.");
    }
    req.session.userId = registeredUser._id;
    req.session.isAdmin = registeredUser.role === "admin";
    req.session.save();
    res.redirect("/app");
  } catch (err) {
    console.log("Login failure:", err);
    req.flash("loginError", err.message);
    req.flash("tempUserData", req.body);
    res.redirect("/app/auth/login");
  }
};

exports.userLogout = (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/app");
  } catch (err) {
    console.log("Logout error :", err);
    res.redirect("/app");
  }
};
