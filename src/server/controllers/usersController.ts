import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import UserModel from "../../database/models/User";
import { UserLogin, UserRegister } from "../../interfaces/User";
import hashCreator from "../../utils/authenticate";
import CustomError from "../../utils/CustomError";

const debug = Debug("philoapp:files:userscontroller");

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  debug("Register request arrived");
  const user: UserRegister = req.body;
  user.password = await hashCreator(user.password);
  try {
    await UserModel.create(user);
    res
      .status(201)
      .json({ message: "User was created in the database correctly" });
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

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const loggedUser: UserLogin = req.body;

  const loginError = new CustomError(
    403,
    "User not found",
    "User or password not valid"
  );

  let findUser: Array<UserRegister>;
  try {
    findUser = await UserModel.find({ username: loggedUser.username });
    if (findUser.length === 0) {
      next(loginError);
      return;
    }
  } catch (error) {
    const errorFinding = new CustomError(
      403,
      `name: ${(error as Error).name}; message:  ${(error as Error).message}`,
      "User or password not valid"
    );
    next(errorFinding);
  }

  res.status(200).json("login funcionando ?");
};
