import boom from "boom";
import express from "express";
import bodyParser from "body-parser";
import validator from "express-joi-validator";

import {
  apiPostMovementSchema,
  apiUpdateMovementSchema
} from "domains/movement/schemas";

import {
  createMovementOrThrow,
  updateMovement,
  deleteMovement
} from "server/controllers/movements";

const jsonParser = bodyParser.json();
const api = express();

api.post(
  "/",
  jsonParser,
  validator(apiPostMovementSchema),
  (req, res, next) => {
    const { body } = req;

    createMovementOrThrow(body)
      .then(result => res.send(result))
      .catch(error => next(error));
  }
);

api.put(
  "/:id",
  jsonParser,
  validator(apiUpdateMovementSchema),
  (req, res, next) => {
    const { body, params } = req;

    // useless update
    if (!Object.keys(body).length) {
      return next(boom.badRequest());
    }

    updateMovement(params.id, body)
      .then(result => res.send(result))
      .catch(error => next(error));
  }
);

api.delete("/:id", (req, res) => {
  const { id } = req.params;

  deleteMovement(id).then(result => res.send(result));
});

export default api;
