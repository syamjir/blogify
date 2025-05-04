const initDatabase = require("./db/init");
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
const RedisStore = require("connect-redis")(expressSession);
const { createClient } = require("redis");

const port = process.env.NODE_PORT || 4000;
initDatabase();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(
  expressSession({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, 
      dbName: "sessions", 
      collectionName: "userSessions", 
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));

app.use(router);

app.listen(port, () => {
  console.log(`Server running on the port ${port}`);
});
