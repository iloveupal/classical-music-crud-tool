import Joi from "joi";
import { AVAILABLE_KEYS } from "framework/constants/keys";
import {
  RECORDING_MAXIMAL_YEAR,
  RECORDING_MINIMAL_YEAR
} from "domains/recording/constants";

export const compositionsFilterSchema = {
  text: Joi.string(),
  movement: Joi.string(),
  key: Joi.string().valid(AVAILABLE_KEYS),
  performer: Joi.string(),
  type: Joi.string(),
  year: Joi.number()
    .min(RECORDING_MINIMAL_YEAR)
    .max(RECORDING_MAXIMAL_YEAR)
};

export const apiListCompositionsSchema = {
  query: {
    search: compositionsFilterSchema,
    limit: Joi.number()
      .min(1)
      .max(200)
      .default(50),
    offset: Joi.number().default(0),
    sort: Joi.string()
  }
};

export const apiPostCompositionSchema = {
  body: {
    title: Joi.string(),
    composer: Joi.string()
  }
};

export const apiUpdateCompositionSchema = {
  body: {
    title: Joi.string(),
    composer: Joi.string()
  }
};
