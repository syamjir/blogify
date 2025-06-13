// stop the MongoDB instance when our tests are finished

async function globalTeardown() {
  await global.__MONGOINSTANCE.stop();
}

module.exports = globalTeardown;
