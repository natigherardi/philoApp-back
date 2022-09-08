import { JwtPayload } from "jsonwebtoken";
import { NextFunction, Response } from "express";
import CustomRequest from "../../interfaces/CustomRequest";
import { verifyToken } from "../../utils/authenticate/authenticate";
import CustomError from "../../utils/CustomError";

const authUser = (
  request: CustomRequest,
  _response: Response,
  next: NextFunction
) => {
  const authError = new CustomError(400, "Authentication error", "Bad request");
  const authData = request.get("Authorization");

  if (!authData || !authData.startsWith("Bearer ")) {
    next(authError);
    return;
  }

  const token = authData.slice(7);
  const tokenInfo = verifyToken(token);

  if (typeof tokenInfo === "string") {
    next(authError);
    return;
  }

  request.payload = tokenInfo;
  next();
};

export default authUser;
