import { NextFunction, Request, Response } from "express";
import CustomRequest from "../../interfaces/CustomRequest";
import authentication from "./authUser";

let mockVerify = jest.fn();
jest.mock("../../utils/authenticate/authenticate", () => ({
  ...jest.requireActual("../../utils/authenticate/authenticate"),
  verifyToken: (token: string) => mockVerify(token),
}));

describe("Given an authorization middleware", () => {
  afterEach(() => jest.clearAllMocks());
  const response = {};
  const next = jest.fn();
  const tokenHeader = "Bearer 123";

  describe("When it's called and it receives a request with valid token", () => {
    const request: Partial<CustomRequest> = {
      get: jest.fn().mockReturnValue(tokenHeader),
    };
    test("Then the verify token function should be called with the token received", () => {
      authentication(
        request as CustomRequest,
        response as Response,
        next as NextFunction
      );

      expect(mockVerify).toHaveBeenCalledWith(tokenHeader.slice(7));
    });

    test("And then returned data should be assigned as the request payload adn next should be called", () => {
      const user = { username: "mockUser", id: "mockUser" };
      mockVerify = jest.fn().mockResolvedValue(user);
      const error = new Error();

      authentication(
        request as CustomRequest,
        response as Response,
        next as NextFunction
      );
      expect(next).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalledWith(error);
      expect(request).toHaveProperty("payload");
    });
  });

  describe("And when the request doesn't have Authorization header", () => {
    const error = new Error("Bad request");
    test("Then next should be called with an 'Bad request' error", () => {
      const request: Partial<CustomRequest> = {
        get: jest.fn().mockReturnValue(undefined),
      };

      authentication(
        request as CustomRequest,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });

    test("And then if the token is not valid next should also be called with the error", () => {
      const request: Partial<CustomRequest> = {
        get: jest.fn().mockReturnValue(tokenHeader),
      };
      mockVerify = jest.fn().mockReturnValue("test");

      authentication(
        request as CustomRequest,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
