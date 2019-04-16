import Joi from "joi";

import {
  RECORDING_MAXIMAL_YEAR,
  RECORDING_MINIMAL_YEAR
} from "domains/recording/constants";

export const apiPostRecordingSchema = {
  post: {
    year: Joi.number()
      .min(RECORDING_MINIMAL_YEAR)
      .max(RECORDING_MAXIMAL_YEAR),
    performers: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        type: Joi.string()
      })
    ),
    parent: Joi.string().required()
  }
};

export const apiUpdateRecordingSchema = {
  post: {
    year: Joi.number()
      .min(RECORDING_MINIMAL_YEAR)
      .max(RECORDING_MAXIMAL_YEAR),
    performers: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        type: Joi.string()
      })
    )
  }
};
