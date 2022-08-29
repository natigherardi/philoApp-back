import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import UserModel from "../../database/models/User";
import { UserRegister } from "../../interfaces/User";

const debug = Debug("philoapp:files:userscontroller");

interface CustomRequest extends Request {
  body: {
    user: UserRegister;
  };
}

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug("Request arrived");
  // eslint-disable-next-line prefer-destructuring
  const user: UserRegister = req.body.user;
  debug(`Reques arrived with ${user}`);
  try {
    const newUser = await UserModel.create(user);
    res.status(201).json({ user: newUser });
    debug(chalk.green("User created succesfully"));
  } catch (error) {
    debug(chalk.red("Error creating new user"));
    next(error);
  }
};

export default registerUser;
