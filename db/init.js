require("dotenv").config();
const mongoose = require("mongoose");

/**
 * Initialize MongoDB Database Connection
 * --------------------------------------
 * Connects to MongoDB using Mongoose with connection string from environment variables.
 * Logs connection success and errors.
 * Exits process if initial connection fails.
 */

async function initDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL;

  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.on("open", () => {
      console.info("✅ Successfully connected to database:", DATABASE_URL);
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ Database connection error:", err);
    });
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = initDatabase;
