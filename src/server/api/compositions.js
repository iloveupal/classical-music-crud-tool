import express from "express";
import validator from "express-joi-validator";

import bodyParser from "body-parser";

import {
  apiListCompositionsSchema,
  apiPostCompositionSchema
} from "domains/composition/schemas";

import {
  filterCompositions,
  listCompositions,
  getCompositionOrThrow,
  createCompositionOrThrow
} from "server/controllers/compositions";

const api = express();
const jsonParser = bodyParser.json();

api.get("/", validator(apiListCompositionsSchema), (req, res, next) => {
  const { query } = req;

  const controllerFn =
    query.search && Object.keys(query.search).length
      ? filterCompositions
      : listCompositions;

  controllerFn(query)
    .then(results => res.send(results))
    .catch(error => next(error));
});

api.get("/:id", (req, res, next) => {
  const { params } = req;

  getCompositionOrThrow(params.id)
    .then(result => res.send(result))
    .catch(error => next(error));
});

api.post(
  "/",
  jsonParser,
  validator(apiPostCompositionSchema),
  (req, res, next) => {
    const { body } = req;

    createCompositionOrThrow(body)
      .then(result => res.send(result))
      .catch(error => next(error));
  }
);

export default api;
