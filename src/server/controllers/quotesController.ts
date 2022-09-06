import { NextFunction, Request, Response } from "express";
import QuoteModel from "../../database/models/Quote";
import Quote from "../../interfaces/Quote";
import CustomError from "../../utils/CustomError";

const getAllQuotes = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const getQuotesError = new CustomError(
    403,
    "Couldn't find any quotes",
    "Error getting the quotes"
  );

  let quotes: Quote[];
  try {
    quotes = await QuoteModel.find();
    if (quotes.length === 0) {
      next(getQuotesError);
      return;
    }
  } catch (error) {
    const { message } = error as CustomError;
    const errorFinding = new CustomError(
      403,
      `${message}`,
      "Error finding quotes"
    );
    next(errorFinding);
    return;
  }
  res.status(201).json(quotes);
};

export default getAllQuotes;
