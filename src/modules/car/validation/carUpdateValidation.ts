import Joi from "joi";

export const carUpdateSchema = Joi.object({
  modelo: Joi.string(),
  color: Joi.string(),
  year: Joi.number().integer().min(1950).max(2023),
  value_per_day: Joi.string(),
  accessories: Joi.array(),
});
