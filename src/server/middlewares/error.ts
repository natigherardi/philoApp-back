import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import { ValidationError } from "express-validation";
import CustomError from "../../utils/CustomError";
import ErrorValidation from "../../utils/ErrorValidation";

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
    error.details.body.forEach((infoError) =>
      debug(chalk.red(infoError.message))
    );
  } else {
    debug(chalk.red(error.privateMessage));
  }
  res.status(errorCode).json({ error: errorMessage });
};
