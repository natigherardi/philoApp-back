import { ValidationError } from "express-validation";

class ErrorValidation extends ValidationError {
  code: string;

  constructor(
    public statusCode: number,
    public publicMessage: string,
    public privateMessage: string
  ) {
    super({ body: [] }, {});
  }
}

export default ErrorValidation;
