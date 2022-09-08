import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  payload: JwtPayload;
}

export default CustomRequest;
