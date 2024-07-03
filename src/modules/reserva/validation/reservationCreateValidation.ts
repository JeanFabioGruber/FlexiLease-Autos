import Joi from "joi";

export const reservationCreateSchema = Joi.object({
  id_user: Joi.string().required(),
  id_car: Joi.string().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().required(),
});
