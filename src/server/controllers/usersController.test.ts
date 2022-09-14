import { NextFunction, Request, Response } from "express";
import UserModel from "../../database/models/User";
import { UserLogin } from "../../interfaces/User";
import { loginUser, registerUser } from "./usersController";

let mockResultHashCompare = true;

jest.mock("../../utils/authenticate/authenticate", () => ({
  ...jest.requireActual("../../utils/authenticate/authenticate"),

  hashCreator: () => "#",
  hashCompare: () => mockResultHashCompare,
  createToken: () => "mockToken",
}));

describe("When the registerUser function is called", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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
      const error = new Error("Error registering");
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
  const mockedUser: UserLogin = { username: "Pablo", password: "123" };
  const mockedUserFound = { username: "Natalia", password: "123", id: "" };
  const request = { body: mockedUser } as Request;
  const response = {};

  const next = jest.fn();

  describe("And when it receives a request with a valid username 'Natalia' and password '123'", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    UserModel.find = jest.fn().mockResolvedValue([mockedUserFound]);
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    test("Then the status method of the response should be called with 200", async () => {
      const expectedStatus = 200;

      await loginUser(
        request as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("And then the json mehtod of the response should be called with the token created", async () => {
      const expectedResponse = { user: { token: "mockToken" } };

      await loginUser(
        request as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("And when it receives an invalid username that is not found", () => {
    const expectedError = new Error("User or password not valid");
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Then next should be called with an error 'User not found'", async () => {
      UserModel.find = jest.fn().mockResolvedValue([]);

      await loginUser(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("And when the find method returns an error", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    test("Then next should be called with an error 'User not found'", async () => {
      const expectedErrorCatch = new Error("Error finding");

      UserModel.find = jest.fn().mockRejectedValue(expectedErrorCatch);

      await loginUser(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedErrorCatch);
    });
  });

  describe("And when the user is found but the password entered doesn't match", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("Then next should be called with passsword check error", async () => {
      UserModel.find = jest.fn().mockResolvedValue([mockedUser]);
      mockResultHashCompare = false;
      const expectedThrownError = new Error("User or password not valid");

      await loginUser(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedThrownError);
    });
  });
});
