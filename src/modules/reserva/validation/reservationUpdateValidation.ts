import Joi from "joi";

export const reservationUpdateSchema = Joi.object({
  id_user: Joi.string(),
  id_car: Joi.string(),
  start_date: Joi.date(),
  end_date: Joi.date(),
});
