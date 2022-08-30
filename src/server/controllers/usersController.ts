import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import UserModel from "../../database/models/User";
import { UserRegister } from "../../interfaces/User";
import hashCreator from "../../utils/authenticate";
import CustomError from "../../utils/CustomError";

const debug = Debug("philoapp:files:userscontroller");

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug("Request arrived");
  const user: UserRegister = req.body;
  user.password = await hashCreator(user.password);
  try {
    const newUser = await UserModel.create(user);
    res.status(201).json({ user: newUser });
    debug(chalk.green("User created succesfully"));
  } catch (error) {
    const customRegisterError = new CustomError(
      400,
      error.message,
      "Error registering"
    );
    next(customRegisterError);
  }
};

export default registerUser;
