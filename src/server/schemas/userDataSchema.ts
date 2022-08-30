import { Joi } from "express-validation";

const userDataSchema = Joi.object({
  name: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().required(),
});

export default userDataSchema;
