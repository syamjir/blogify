const User = require("../models/userModel");
const path = require("path");
const sharp = require("sharp");
const fs = require("fs");

exports.getUserAccount = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      console.log("User is not found");
      res.redirect("/app");
    }
    res.render("account", { userData: user });
  } catch (err) {
    console.log("Error occurred while retrieving user account:", err);
    res.redirect("/app");
  }
};

exports.updateUserPhoto = async (req, res) => {
  try {
    const image = req.files.image;
    if (!image) {
      throw new Error("No files were uploaded");
    }
    const imageName = `${Date.now()}_${image.name}`;
    const imagePath = `/img/${imageName}`;
    const outputFilePath = path.resolve(
      __dirname,
      "..",
      "public/img",
      imageName
    );
    const resizedImageBuffer = await sharp(image.data)
      .resize(50, 50)
      .toBuffer();
    if (!resizedImageBuffer) {
      throw new Error("Failed t0 resize image");
    }
    const id = req.params.id;
    await fs.promises.writeFile(outputFilePath, resizedImageBuffer);
    const updatedDocument = await User.findByIdAndUpdate(id, {
      image: imagePath,
    });
    console.log(updatedDocument);
    res.redirect(`/app/account/${id}`);
  } catch (err) {
    console.log("Error occured during update profile photo:", err);
    res.redirect("/app");
  }
};
