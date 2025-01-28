const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "A user should have a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "A user should have an email"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "A user should have a password"],
    minlength: [6, "Password must be at least 8 charecters long"],
  },
  image: {
    type: String,
    default: "/img/user.jpeg",
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.plugin(uniqueValidator, { message: "Email must be unique" });
userSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("password")) {
      return next();
    }
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
    next();
  } catch (err) {
    console.log("Password hashing got error:", err);
    // next(err)
  }
});
const User = mongoose.model("User", userSchema);
module.exports = User;
