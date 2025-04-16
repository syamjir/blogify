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

const port = process.env.PORT || 4000;
mongoose
  .connect(
    `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}:27017/blogify?authSource=admin`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Data base connected successfully");
  })
  .catch((err) => {
    console.log("Data base connection failure:", err);
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());

app.use(flash());
const redisClient = createClient({
  legacyMode: true,
  socket: {
    host: "redis", // compose service name
    port: 6379,
  },
});
redisClient.connect().catch(console.error);
app.use(
  expressSession({
    store: new RedisStore({ client: redisClient }),
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
