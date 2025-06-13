const { MongoMemoryServer } = require("mongodb-memory-server");

async function globalSetup() {
  const instance = await MongoMemoryServer.create({
    binary: { version: "6.0.4" },
  });
  global.__MONGOINSTANCE = instance; // set instance as a global variable
  process.env.DATABASE_URL = instance.getUri();
}

module.exports = globalSetup;
