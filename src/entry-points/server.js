import express from "express";
import path from "path";

import getDb from "server/bin/database";
import { store } from "server/ioc";

const DATABASE_URL = "mongodb://localhost:27017";
const DATABASE_NAME = "idagio";

getDb(DATABASE_URL, DATABASE_NAME)
  .then(db => {
    store("db", db);

    return import("server/api").then(({ default: api }) => api);
  })
  .then(api => {
    startApplication(api);
  });

function startApplication(api) {
  const app = express();
  const DIST_DIR = __dirname;
  const HTML_FILE = path.join(DIST_DIR, "./index.html");

  app.use(express.static(DIST_DIR));

  app.use("/api", api);

  app.get("/*", (req, res) => res.sendFile(HTML_FILE));

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`App listening to ${PORT}....`);
    console.log("Press Ctrl+C to quit.");
  });
}
