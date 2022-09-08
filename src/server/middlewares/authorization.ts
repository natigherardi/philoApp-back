import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Response } from "express";
import CustomRequest from "../../interfaces/CustomRequest";
import { verifyToken } from "../../utils/authenticate/authenticate";
import CustomError from "../../utils/CustomError";

const authentication = async (
  request: CustomRequest,
  _response: Response,
  next: NextFunction
) => {
  const authorizationError = new CustomError(
    400,
    "Authentication error",
    "Bad request"
  );
  const authorization = request.get("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(authorizationError);
    return;
  }
  const token = authorization.slice(7);
  let tokenInfo: string | JwtPayload;
  try {
    tokenInfo = verifyToken(token);
  } catch (error) {
    next(authorizationError);
    return;
  }

  if (typeof tokenInfo === "string") {
    next(authorizationError);
    return;
  }

  request.payload = tokenInfo;
  next();
};

export default authentication;
