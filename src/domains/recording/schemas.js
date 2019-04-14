import Joi from "joi";

export const apiPostRecordingSchema = {
  post: {
    year: Joi.number()
      .min(1500)
      .max(new Date().getFullYear()),
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
      .min(1500)
      .max(new Date().getFullYear()),
    performers: Joi.array().items(
      Joi.object({
        name: Joi.string(),
        type: Joi.string()
      })
    )
  }
};
