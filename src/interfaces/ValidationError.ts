interface BodyType {
  message: string;
  path: [string];
  type: string;
  context: {
    label: string;
    value: string;
    key: string;
  };
}

interface ErrorValidation {
  name: string;
  message: string;
  statusCode: number;
  error: string;
  details: {
    body: BodyType[];
  };
}

export default ErrorValidation;
