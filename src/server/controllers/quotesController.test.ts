import { error } from "console";
import { NextFunction, Request, Response } from "express";
import QuoteModel from "../../database/models/Quote";
import UserModel from "../../database/models/User";
import CustomError from "../../utils/CustomError";
import {
  createQuote,
  deleteQuote,
  getAllQuotes,
  getQuotesByUser,
  getQuoteById,
} from "./quotesController";

describe("Given the getAllQuotes function from the quotesController", () => {
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
      const expectedReponse = { quotes: { publicQuotes: quotes } };

      await getAllQuotes(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.json).toHaveBeenCalledWith(expectedReponse);
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

describe("Given the getQuotesByUser function from the quotesController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const request = {
    query: { id: "testId" },
  } as Partial<Request>;
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  describe("When it's invoked and it receives a request and the user received is found and has quotes", () => {
    const next = () => {};
    const userPopulated = {
      name: "mockUser",
      username: "mockUser",
      quotesCreated: [
        {
          textContent: "",
          author: "",
          owner: "testId",
          image: "",
          year: 0,
          school: "",
          book: "",
          favoritedBy: [""],
          id: "",
        },
      ],
      quotesFavorited: [
        {
          textContent: "",
          author: "",
          owner: "",
          image: "",
          year: 0,
          school: "",
          book: "",
          favoritedBy: ["testId"],
          id: "",
        },
      ],
      id: "testId",
    };

    test("Then the status method of the repsonseshould be called with 200", async () => {
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
        quotes: {
          quotesCreated: userPopulated.quotesCreated,
          quotesFavorited: userPopulated.quotesFavorited,
        },
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
      const expectedError = new Error("There was a problem loading the quotes");
      UserModel.findById = jest.fn().mockResolvedValue(null);

      await getQuotesByUser(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the delete quote function from the quotesController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const quoteId = "6310d724c2e50669e79b0fb5";
  const request = {
    query: { id: quoteId },
    body: { user: "123" },
  } as Partial<Request>;
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  const expectedError = new Error("Couldn't delete the quote");
  const mockDelete = { mock: "mockDeleted" };
  const next = jest.fn();
  describe("When it is called with request with valid ID and the user is the owner of the quote", () => {
    QuoteModel.findByIdAndDelete = jest.fn().mockReturnValue(mockDelete);
    QuoteModel.findById = jest
      .fn()
      .mockReturnValue({ id: "fakeQuote", owner: "123" });

    test("Then the Quote model method findById should be called with the received id", async () => {
      await deleteQuote(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(QuoteModel.findByIdAndDelete).toHaveBeenCalledWith(quoteId);
    });

    test("Then the status method of the response should be called with 200", async () => {
      const expectedStatus = 200;

      await deleteQuote(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("And then the json method of the response should be called with 'Quote deleted correctly'", async () => {
      const expectedResponse = "Quote deleted correctly";

      await deleteQuote(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.json).toHaveBeenCalledWith(expectedResponse);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("And when the id is not valid", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("Then next fucntion should be called with the error 'Couldn't delete the quote'", async () => {
      QuoteModel.findByIdAndDelete = jest.fn().mockRejectedValue(error);

      await deleteQuote(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("And when the user is not the owner of the quote", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("Then next fucntion should be called with the error 'Couldn't delete the quote'", async () => {
      QuoteModel.findById = jest
        .fn()
        .mockReturnValue({ id: "fakeQuote", owner: "000" });
      QuoteModel.findByIdAndDelete = jest.fn();

      await deleteQuote(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(QuoteModel.findByIdAndDelete).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given the create Quote function from the QuotesController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const mockUserId = "testId";
  const mockUser = new UserModel({
    name: "test name",
    username: "test username",
    password: "test password",
    quotesCreated: [{ id: "1" }],
    quotesFavorited: [],
  });
  const mockNewQuote = {
    textContent: "test",
    author: "test",
    owner: mockUserId,
    book: "test",
    image: "test",
    school: "test",
    year: 1,
  };

  const request = {
    query: { id: mockUserId },
    body: mockNewQuote,
  } as Partial<Request>;
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  const next = jest.fn();

  describe("When it is called with a request with valid user id and quote data", () => {
    const mockCreate = jest.fn().mockResolvedValue(mockNewQuote);

    mockUser.save = jest.fn();

    test("Then the create method of the Quote model should be called with the data received", async () => {
      QuoteModel.create = mockCreate;
      UserModel.findById = jest.fn().mockResolvedValue(mockUser);

      await createQuote(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(mockCreate).toHaveBeenCalledWith(mockNewQuote);
    });

    test("And then the status mehtod of the response should be called with 201", async () => {
      const expectedStatus = 201;
      QuoteModel.create = mockCreate;
      UserModel.findById = jest.fn().mockResolvedValueOnce(mockUser);

      await createQuote(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("And then the json method of the response should be called with the quote created", async () => {
      QuoteModel.create = mockCreate;
      UserModel.findById = jest.fn().mockResolvedValueOnce(mockUser);

      await createQuote(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.json).toHaveBeenCalledWith(mockNewQuote);
    });
  });

  describe("And when it is called and mogoose responds qith an error", () => {
    test("Then next should ba called with the error received", async () => {
      const expectedError = new Error("We couldn't create the quote");
      QuoteModel.create = jest.fn().mockRejectedValue(expectedError);

      await createQuote(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});

describe("Given a getQuoteById from the quotes controller", () => {
  const request = {
    params: { id: "test" },
  } as Partial<Request>;
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;
  const next = jest.fn();

  describe("When it is called and it receives a valid quote id", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
    test("Then the status method of the response should be called with 200", async () => {
      const expectedStatus = 200;
      QuoteModel.findById = jest.fn().mockResolvedValue("mockQuote");

      await getQuoteById(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then the status method of the response should be called with 200", async () => {
      const expectedResponse = { quote: "mockQuote" };
      QuoteModel.findById = jest.fn().mockResolvedValue("mockQuote");

      await getQuoteById(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(response.json).toHaveBeenCalledWith(expectedResponse);
    });
  });

  describe("And when it's called and it receives an invalid quote ID", () => {
    test("Then nexst should be called with the get quote error", async () => {
      const expectedError = new CustomError(
        400,
        "Error getting the quote",
        "We couldn't get the quote"
      );
      QuoteModel.findById = jest.fn().mockResolvedValue(null);

      await getQuoteById(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });

  describe("And when it's called and the method findById returns an error", () => {
    test("Then next should be called with the error message received", async () => {
      const rejectError = new Error("Mock error message");
      const expectedError = new CustomError(
        400,
        "Mock error message",
        "We couldn't get the quote"
      );
      QuoteModel.findById = jest.fn().mockRejectedValue(rejectError);

      await getQuoteById(
        request as Request,
        response as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
