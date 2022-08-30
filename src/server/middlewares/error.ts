import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import ErrorCoded from "../../interfaces/ErrorCoded";
import CustomError from "../../utils/CustomError";

const debug = Debug("philoapp:middlewares:error");

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
  debug("Wrong endpoint");
};

export const generalError = (
  _req: Request,
  res: Response,
  _next: NextFunction,
  error: CustomError
) => {
  const errorCode = error.statusCode ?? 500;
  const errorMessage =
    error.publicMessage ?? "There has been a problem. Try again please";

  debug(chalk.red(error.privateMessage));

  res.status(errorCode).json({ error: errorMessage });
};
