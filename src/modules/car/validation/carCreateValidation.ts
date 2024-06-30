import Joi from "joi";

export const carCreateSchema = Joi.object({
  modelo: Joi.string().required(),
  color: Joi.string().required(),
  year: Joi.number().required(),
  value_per_day: Joi.number().required(),
  accessories: Joi.array().required(),
  number_of_passengers: Joi.number().required(),
});
