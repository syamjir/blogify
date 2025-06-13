const mongoose = require("mongoose");
const { beforeAll, afterAll } = require("@jest/globals");
const initDatabase = require("../db/init.js");

beforeAll(async () => {
  await initDatabase();
});
afterAll(async () => {
  await mongoose.disconnect();
});
