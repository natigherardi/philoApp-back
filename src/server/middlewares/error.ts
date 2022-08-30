import chalk from "chalk";
import Debug from "debug";
import { NextFunction, Request, Response } from "express";
import CustomError from "../../utils/CustomError";
import ErrorValidate from "../../interfaces/ValidateError";

const debug = Debug("philoapp:middlewares:error");

export const notFoundError = (req: Request, res: Response) => {
  res.status(404).json({ error: "Endpoint not found" });
  debug("Wrong endpoint");
};

export const generalError = (
  error: CustomError | ErrorValidate,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const errorCode = error.statusCode ?? 500;
  let errorMessage: string;
  if ((error as ErrorValidate).name) {
    errorMessage = "Wrong data entered";
    const privateMessage = (error as ErrorValidate).details.body[0].message;
    debug(chalk.red(`Error: ${privateMessage}`));
  } else {
    errorMessage =
      (error as CustomError).publicMessage ??
      "There has been a problem. Try again please";
    debug(chalk.red((error as CustomError).privateMessage));
  }
  res.status(errorCode).json({ error: errorMessage });
};
