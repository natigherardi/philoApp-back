import { NextFunction, Request, Response } from "express";
import QuoteModel from "../../database/models/Quote";
import UserModel from "../../database/models/User";
import { getAllQuotes, getQuotesByUser } from "./quotesController";

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
    const quotes = [{ textContent: "", author: "", user: "", image: "" }];
    QuoteModel.find = jest.fn().mockResolvedValue(quotes);

    test("Then the status method of the response should be called with 201", async () => {
      const statusOk = 200;

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

describe("Given a getQuotesByUser function returned by the quotesController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const request = {
    query: { id: "6310d724c2e50669e79b0fb5" },
  } as Partial<Request>;
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  describe("When it's invoked and it receives a request and the response is succesfull", () => {
    const next = () => {};
    const userPopulated = {
      name: "patata",
      username: "patata",
      quotesCreated: [
        {
          textContent: "I think, therefore I am",
          author: "René Descartes",
          owner: "6310d724c2e50669e79b0fb5",
          image:
            "https://www.alejandradeargos.com/images/filosofos/descartes/Rene_Descartes.jpg",
          year: 1650,
          school: "Cartesianism",
          book: "Discourse on the Method of Rightly Conducting One's Reason and of Seeking Truth in the Sciences",
          favoritedBy: ["6310d724c2e50669e79b0fb5"],
          id: "6319125bd048c740c65fa9a4",
        },
      ],
      quotesFavorited: [
        {
          textContent: "I think, therefore I am",
          author: "René Descartes",
          owner: "6310d724c2e50669e79b0fb5",
          image:
            "https://www.alejandradeargos.com/images/filosofos/descartes/Rene_Descartes.jpg",
          year: 1650,
          school: "Cartesianism",
          book: "Discourse on the Method of Rightly Conducting One's Reason and of Seeking Truth in the Sciences",
          favoritedBy: ["6310d724c2e50669e79b0fb5"],
          id: "6319125bd048c740c65fa9a4",
        },
      ],
      id: "6310d724c2e50669e79b0fb5",
    };

    test("Then if the user is found and it has quotes the status method should be called with 200", async () => {
      UserModel.findById = jest.fn().mockReturnThis();
      UserModel.populate = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValueOnce(userPopulated),
      });

      await getQuotesByUser(
        request as Request,
        response as Response,
        next as NextFunction
      );
      expect(response.status).toHaveBeenCalledWith(200);
    });
    test("And then the json method of the response should be called with the quotes received", async () => {
      UserModel.findById = jest.fn().mockReturnThis();
      UserModel.populate = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValueOnce(userPopulated),
      });
      const expectedResponse = {
        quotesCreated: userPopulated.quotesCreated,
        quotesFavorited: userPopulated.quotesFavorited,
      };

      await getQuotesByUser(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("And when it's invoked but the data base throws an error", () => {
    test("Then next should be called with an error with message 'There was a problem loading the quotes'", async () => {
      const next = jest.fn();
      const error = new Error("There was a problem loading the quotes");
      UserModel.findById = jest.fn().mockResolvedValue(null);

      await getQuotesByUser(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
