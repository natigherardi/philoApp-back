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

interface ErrorValidate {
  name: string;
  message: string;
  statusCode: number;
  error: string;
  details: {
    body: BodyType[];
  };
}

export default ErrorValidate;
