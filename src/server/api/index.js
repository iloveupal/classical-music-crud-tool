import assert from "assert";

import express from "express";

import compositionsApi from "./compositions";
import movementsApi from "./movements";
import recordingsApi from "./recordings";

const api = express();

function handleErrors(err, req, res, next) {
  if (err.isBoom) {
    return res.status(err.output.statusCode).json(err.output.payload);
  } else {
    assert.fail(err);
  }
}

api.use("/compositions", compositionsApi);
api.use("/movements", movementsApi);
api.use("/recordings", recordingsApi);

api.use(handleErrors);

export default api;
