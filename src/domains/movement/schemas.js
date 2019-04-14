import Joi from "joi";
import { AVAILABLE_KEYS } from "framework/constants/keys";

export const apiPostMovementSchema = {
  body: {
    title: Joi.string(),
    key: Joi.string().valid(AVAILABLE_KEYS),
    parent: Joi.string().required()
  }
};

export const apiUpdateMovementSchema = {
  body: {
    title: Joi.string(),
    key: Joi.string().valid(AVAILABLE_KEYS)
  }
};
