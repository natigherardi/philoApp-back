import { NextFunction, Request, Response } from "express";
import CustomError from "../../utils/CustomError";
import ErrorValidation from "../../utils/ErrorValidation";
import { generalError, notFoundError } from "./error";

describe("Given a not found Error middleware", () => {
  describe("When it's called and it receives a request object", () => {
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

  describe("And when it receives an error because the data of the req body doesn't match the data user schema", () => {
    test("Then the response method json should be called with 'Wrong data entered", () => {
      const request = {};
      const next = {};
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const message = "Wrong data entered";
      const error = new ErrorValidation(400, message, "");

      generalError(
        error,
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.json).toHaveBeenCalledWith({ error: message });
    });
  });

  describe("And when it receives an error with falsy status code and public message", () => {
    describe("When it's called and it receives a response object and an error", () => {
      const request = {};
      const next = {};
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      const statusCode = undefined as undefined;
      const publicMessage = undefined as undefined;
      const error = { statusCode, publicMessage };

      generalError(
        error as CustomError,
        request as Request,
        response as Response,
        next as NextFunction
      );

      test("Then the response method status should be called with the default code status", () => {
        const expectedStatus = 500;

        expect(response.status).toHaveBeenCalledWith(expectedStatus);
      });

      test("And then the response metod json should be called with", () => {
        const expectedErrorMessage = {
          error: "There has been a problem. Try again please",
        };

        expect(response.json).toHaveBeenCalledWith(expectedErrorMessage);
      });
    });
  });
});
