import express from "express";
import path from "path";
import fs from "fs";
import { exec } from "child_process";

import getDb from "server/bin/database";
import { store } from "server/ioc";

import { MongoMemoryServer } from "mongodb-memory-server";

const mongod = new MongoMemoryServer({
  autoStart: false
});

const globalConfigPath = path.join(__dirname, "globalConfig.json");

const startApp = async cb => {
  if (!mongod.isRunning) {
    await mongod.start();
  }

  const mongoConfig = {
    mongoDBName: "jest",
    mongoUri: await mongod.getConnectionString()
  };

  // Write global config to disk because all tests run in different contexts.
  fs.writeFileSync(globalConfigPath, JSON.stringify(mongoConfig));

  // Set reference to mongod in order to close the server during teardown.
  global.__MONGOD__ = mongod;

  getDb(mongoConfig.mongoUri, mongoConfig.mongoDBName)
    .then(db => {
      store("db", db);

      return import("server/api").then(({ default: api }) => api);
    })
    .then(api => {
      startApi(api, cb);
    });
};

function startApi(api, cb) {
  const app = express();

  app.use("/api", api);

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, cb);
}

startApp(() => {
  console.log("------ TESTS ARE STARTING -------");
  exec("yarn run-server-tests", (err, stdout, stderr) => {
    if (err) {
      console.log(err);
    }

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
});
