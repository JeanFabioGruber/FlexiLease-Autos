import Joi from "joi";

export const userUpdateSchema = Joi.object({
  name: Joi.string(),
  cpf: Joi.string(),
  birth: Joi.date(),
  email: Joi.string().email(),
  password: Joi.string().min(6),
  cep: Joi.string(),
  qualified: Joi.string().valid("sim", "não"),
});
