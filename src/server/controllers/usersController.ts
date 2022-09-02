import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import UserModel from "../../database/models/User";
import JwtPayload from "../../interfaces/JwtPayload";
import { UserFullData, UserLogin, UserRegister } from "../../interfaces/User";
import {
  createToken,
  hashCompare,
  hashCreator,
} from "../../utils/authenticate";
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

  let foundUser: Array<UserFullData>;
  try {
    foundUser = await UserModel.find({ username: loggedUser.username });
    if (foundUser.length === 0) {
      debugger;
      next(loginError);
      debugger;
      return;
    }
  } catch (error) {
    const errorFinding = new CustomError(
      403,
      `name: ${(error as Error).name}; message:  ${(error as Error).message}`,
      "User or password not valid"
    );
    next(errorFinding);
    return;
  }
  const [user] = foundUser;
  try {
    const isPassWordCorrect = await hashCompare(
      loggedUser.password,
      user.password
    );
    if (!isPassWordCorrect) {
      loginError.privateMessage = "Password invalid";
      next(loginError);
      return;
    }
  } catch (error) {
    const passwordCheckError = new CustomError(
      403,
      `name: ${(error as Error).name}; message:  ${(error as Error).message}`,
      "User or password not valid"
    );
    next(passwordCheckError);
    return;
  }
  const jwtPayload: JwtPayload = {
    id: user.id,
    username: user.username,
  };
  const responseWithToken = {
    user: {
      token: createToken(jwtPayload),
    },
  };
  res.status(200).json(responseWithToken);
};
