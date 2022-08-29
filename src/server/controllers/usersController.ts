import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import UserModel from "../../database/models/User";
import { RequestBodyUser } from "../../interfaces/User";

const debug = Debug("philoapp:files:userscontroller");

const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug("Request arrived");
  const requestUser: RequestBodyUser = req.body;
  const { user } = requestUser;
  try {
    const newUser = await UserModel.create(user);
    res.status(201).json(newUser);
    debug(chalk.green("User created succesfully"));
  } catch (error) {
    debug(chalk.red("Error creating new user"));
    next(error);
  }
};

export default registerUser;
