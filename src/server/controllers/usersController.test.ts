import { NextFunction, Request, Response } from "express";
import UserModel from "../../database/models/User";
import { UserLogin } from "../../interfaces/User";
import { loginUser, registerUser } from "./usersController";

const mockResultHashCompare = true;

jest.mock("../../utils/authenticate", () => ({
  ...jest.requireActual("../../utils/authenticate"),

  hashCreator: () => "#",
  hashCompare: () => mockResultHashCompare,
  createToken: () => "testing",
}));

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  jest.clearAllMocks();
});

describe("When the registerUser function is called", () => {
  describe("When it's invoked, it receives a request object and the response is succesfull", () => {
    const dataUser = { name: "", username: "", password: "123" };
    const request = { body: dataUser } as Request;
    const next = () => {};
    let response: Partial<Response>;
    beforeEach(async () => {
      response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      UserModel.create = jest.fn().mockResolvedValue(dataUser);
      await registerUser(
        request as Request,
        response as Response,
        next as NextFunction
      );
    });

    test("Then the status method of the response should be called with 201", () => {
      const statusOk = 201;

      expect(response.status).toHaveBeenCalledWith(statusOk);
    });

    test("And then the json method of the response should be called with a user object", () => {
      expect(response.json).toHaveBeenCalledWith({
        message: "User was created in the database correctly",
      });
    });
  });

  describe("And when the response is unsuccessfull", () => {
    test("Then the next function should be called with an error", async () => {
      const dataUser = { username: "", password: "123" };
      const request = { body: dataUser } as Request;
      const next = jest.fn();
      const response = {} as Partial<Response>;
      const error = new Error();
      UserModel.create = jest.fn().mockRejectedValue(error);

      await registerUser(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("When the loginUser function is called", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  let res: Partial<Response>;
  const mockedUser: UserLogin = { username: "Natalia", password: "123" };
  const mockedUserFound = { username: "Natalia", password: "123", id: "" };
  const request = { body: mockedUser } as Request;
  let next: NextFunction;
  beforeEach(async () => {
    next = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    await loginUser(request as Request, res as Response, next as NextFunction);
  });

  describe("And when it receives a request with a valid username 'Natalia' and password '123'", () => {
    UserModel.find = jest.fn().mockResolvedValue([mockedUserFound]);

    test("Then the status method of the response should be called with 200", async () => {
      const expectedStatus = 200;

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("And then the json mehtod of the response should be called with the token created", async () => {
      const expectedResponse = { user: { token: "testing" } };

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  /* describe("And when it receives an invalid username 'Pablo' that is not found", () => {
    const mockedUser: UserLogin = { username: "Pablo", password: "123" };
    beforeEach(() => {
      jest.clearAllMocks();
    });
    //
    // 
    //   await loginUser(
    //     request as Request,
    //     res as Response,
    //     next as NextFunction
    //   );
    // });

    test.only("Then next should be called with an error", async () => {

const myreq = { body: mockedUser } as Request;
  next = jest.fn() as NextFunction;
      const myres = {
         status: jest.fn().mockReturnThis(),
         json: jest.fn(),
    } as Partial<Response>;


      const nextMock = jest.fn();
      UserModel.find = jest.fn().mockResolvedValue([]);
      const expectedError = {
        statusCode: 403,
        privateMessage: "User not found",
        publicMessage: "User or password not valid",
      };

      await loginUser(
        myreq as Request,
        myres as Response,
        nextMock as NextFunction
      );

      expect(nextMock).toHaveBeenCalledWith(expectedError);
  )}  */
});
