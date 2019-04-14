import boom from "boom";

import express from "express";
import bodyParser from "body-parser";
import formidable from "express-formidable";
import validator from "express-joi-validator";

import {
  handleRecordingUpload,
  createRecordingOrThrow
} from "server/controllers/recordings";

import { apiPostRecordingSchema } from "domains/recording/schemas";

const api = express();
const jsonParser = bodyParser.json();

api.post("/upload", formidable(), (req, res, next) => {
  if (!req.files.file) {
    return next(boom.badRequest("File should be uploaded with file field"));
  }

  handleRecordingUpload(req.files.file)
    .then(result => res.send(result))
    .catch(error => next(error));
});

api.post(
  "/",
  jsonParser,
  validator(apiPostRecordingSchema),
  (req, res, next) => {
    const { body } = req;

    createRecordingOrThrow(body)
      .then(result => res.send(result))
      .catch(error => next(error));
  }
);

export default api;
