import Joi from "joi";
import { AVAILABLE_KEYS } from "framework/constants/keys";

export const compositionsFilterSchema = {
  text: Joi.string(),
  movement: Joi.string(),
  key: Joi.string().valid(AVAILABLE_KEYS),
  performer: Joi.string(),
  type: Joi.string(),
  year: Joi.number()
    .min(1500)
    .max(new Date().getFullYear())
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
