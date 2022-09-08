import JwtPayload from "./JwtPayload";

interface CustomRequest extends Request {
  payload: JwtPayload;
}

export default CustomRequest;
