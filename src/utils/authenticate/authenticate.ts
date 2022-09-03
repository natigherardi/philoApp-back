import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import JwtPayload from "../../interfaces/JwtPayload";

export const hashCreator = (password: string) => {
  const salt = 10;
  return bcrypt.hash(password, salt);
};

export const hashCompare = (
  passwordEntered: string,
  passwordDBHashed: string
) => bcrypt.compare(passwordEntered, passwordDBHashed);

export const createToken = (payload: JwtPayload) =>
  jwt.sign(payload, process.env.SECRET);

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.SECRET);
