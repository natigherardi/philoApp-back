import ErrorCoded from "../interfaces/ErrorCoded";

class CustomError extends Error implements ErrorCoded {
  code: string;

  constructor(
    public statusCode: number,
    public privateMessage: string,
    public publicMessage: string
  ) {
    super(privateMessage);
  }
}

export default CustomError;
