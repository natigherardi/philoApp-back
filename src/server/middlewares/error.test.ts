import { NextFunction, Request, Response } from "express";
import CustomError from "../../utils/CustomError";
import { generalError, notFoundError } from "./error";

describe("Given a not found Error middleware", () => {
  describe("When it's called and it receives a response object", () => {
    const request = {};
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;

    notFoundError(request as Request, response as Response);

    test("Then the response method status should be called with 404", () => {
      const status = 404;

      expect(response.status).toHaveBeenCalledWith(status);
    });

    test("And then the response method json should be called with 'Endpoint not found'", () => {
      const message = { error: "Endpoint not found" };

      expect(response.json).toHaveBeenCalledWith(message);
    });
  });
});

describe("Given a general error middleware", () => {
  describe("When it's called and it receives a response object and an error", () => {
    const request = {};
    const next = {};
    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    const error = { statusCode: 0, publicMessage: "Error" };

    generalError(
      error as CustomError,
      request as Request,
      response as Response,
      next as NextFunction
    );

    test("Then the response method status should be called with the code status of the error received", () => {
      expect(response.status).toHaveBeenCalledWith(error.statusCode);
    });

    test("And then the response metod json should be called with", () => {
      const expectedErrorMessage = { error: error.publicMessage };

      expect(response.json).toHaveBeenCalledWith(expectedErrorMessage);
    });
  });
});
