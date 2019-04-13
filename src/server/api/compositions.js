import express from "express";
import validator from "express-joi-validator";

import { apiListCompositionsSchema } from "Domains/composition/schemas";

import {
  filterCompositions,
  getCompositionOrThrow
} from "server/controllers/compositions";

const api = express();

api.get("/", validator(apiListCompositionsSchema), (req, res, next) => {
  const { query } = req;

  filterCompositions(query)
    .then(results => res.send(results))
    .catch(error => next(error));
});

api.get("/:id", (req, res, next) => {
  const { params } = req;

  getCompositionOrThrow(params.id)
    .then(result => res.send(result))
    .catch(error => next(error));
});

export default api;
