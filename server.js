const initDatabase = require("./db/init");
const express = require("express");
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const expressSession = require("express-session");
const router = require("./routes/index");
const MongoStore = require("connect-mongo");
const cors = require("cors");

const app = express();
const port = process.env.NODE_PORT || 4000;

// Enable CORS for cross-origin requests
app.use(cors());

// Initialize MongoDB connection
initDatabase();

// Body parser middleware for handling JSON and URL-encoded form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Flash middleware for storing messages in session
app.use(flash());

// Session middleware setup with MongoDB session store
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
    cookie: { maxAge: 1000 * 60 * 60 * 24 }, // Session cookie valid for 1 day
  })
);

// Set view engine to EJS and configure views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static assets from the "public" folder
app.use(express.static("public"));

// Use main application routes
app.use(router);

// Start the Express server on the specified port
app.listen(port, () => {
  console.log(`Server running on the port ${port}`);
});
