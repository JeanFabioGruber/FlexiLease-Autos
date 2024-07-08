import Joi from "joi";

export const userCreateSchema = Joi.object({
  name: Joi.string().required(),
  cpf: Joi.string().required(),
  birth: Joi.date().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  cep: Joi.string().required(),
  qualified: Joi.string().valid("sim", "não").required(),
});
