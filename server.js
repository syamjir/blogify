const express = require("express");
require("dotenv").config();
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const expressSession = require("express-session");
const router = require("./routes/index");
const fileUpload = require("express-fileupload");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const app = express();
app.use(cors());

const port = process.env.PORT || 4000;
mongoose
  .connect(
    `mongodb+srv://rsyamjir:${process.env.PASSWORD}@cluster0.xh6fb.mongodb.net/my_database`,
    { autoIndex: false }
  )
  .then(() => {
    console.log("Data base connected successfully");
  })
  .catch((err) => {
    console.log("Data base connection failure:", err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./public/img/temp",
  })
);

app.use(flash());
app.use(
  expressSession({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://rsyamjir:${process.env.PASSWORD}@cluster0.xh6fb.mongodb.net/my_database`, // MongoDB URI
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

app.use(router);

app.listen(port, () => {
  console.log(`Server running on the port ${port}`);
});
