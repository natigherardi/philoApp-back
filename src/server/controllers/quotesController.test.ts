import { NextFunction, Request, Response } from "express";
import QuoteModel from "../../database/models/Quote";
import getAllQuotes from "./quotesController";

describe("Given a getAllQuotes function returned by the quotesController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const request = {} as Request;
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  describe("When it's invoked and it receives a request and the response is succesfull", () => {
    const next = () => {};
    const quotes = [{ textContent: "", author: "", user: "" }];
    QuoteModel.find = jest.fn().mockResolvedValue(quotes);

    test("Then the status method of the response should be called with 201", async () => {
      const statusOk = 201;

      await getAllQuotes(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.status).toHaveBeenCalledWith(statusOk);
    });

    test("And then the json method of the response should be called with the quotes received", async () => {
      await getAllQuotes(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.json).toHaveBeenCalledWith(quotes);
    });
  });

  describe("And when the response is error", () => {
    test("Then next should be called with an error with message 'Error getting the quotes'", async () => {
      const next = jest.fn();
      const expectedError = new Error("Error finding quotes");
      QuoteModel.find = jest.fn().mockRejectedValue(expectedError);

      await getAllQuotes(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("And when no quotes are found", () => {
    test("Then next should be called with an error with message 'Error getting the quotes'", async () => {
      const next = jest.fn();
      const expectedError = new Error("Error getting the quotes");
      QuoteModel.find = jest.fn().mockResolvedValue([]);

      await getAllQuotes(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
