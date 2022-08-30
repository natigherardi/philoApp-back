import chalk from "chalk";
import Debug from "debug";
import { ValidationError } from "express-validation";
import { NextFunction, Request, Response } from "express";
import CustomError from "../../utils/CustomError";

const debug = Debug("philoapp:middlewares:error");

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
  debug("Wrong endpoint");
};

export const generalError = (
  error: CustomError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const errorCode = error.statusCode ?? 500;
  let errorMessage =
    error.publicMessage ?? "There has been a problem. Try again please";

  if (error instanceof ValidationError) {
    errorMessage = "Wrong data entered";
    const privateMessage = `Error: ${error.details.body[0].message}`;
    debug(chalk.red(privateMessage));
  } else {
    debug(chalk.red(error.privateMessage));
  }
  res.status(errorCode).json({ error: errorMessage });
};
