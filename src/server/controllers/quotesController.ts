import { NextFunction, Request, Response } from "express";
import QuoteModel from "../../database/models/Quote";
import UserModel from "../../database/models/User";
import Quote from "../../interfaces/Quote";
import CustomError from "../../utils/CustomError";

export const getAllQuotes = async (
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
  res.status(200).json({ quotes: { publicQuotes: quotes } });
};

export const getQuotesByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: userId } = req.query;

  try {
    const { quotesCreated, quotesFavorited } = await UserModel.findById(userId)
      .populate({
        path: "quotesFavorited",
        model: QuoteModel,
      })
      .populate({ path: "quotesCreated", model: QuoteModel });
    res.status(200).json({ quotes: { quotesCreated, quotesFavorited } });
  } catch (error) {
    const quotesByUserError = new CustomError(
      404,
      error.message,
      "There was a problem loading the quotes"
    );
    next(quotesByUserError);
  }
};

export const deleteQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id: quoteId } = req.query;
  const { user: userId } = req.body;
  const deleteError = new CustomError(
    400,
    "Error deleting quote",
    "Couldn't delete the quote"
  );
  try {
    const quoteToDelete = await QuoteModel.findById(quoteId);

    if (quoteToDelete.owner !== userId) {
      next(deleteError);
      return;
    }
    await QuoteModel.findByIdAndDelete(quoteId);
    res.status(200).json("Quote deleted correctly");
  } catch (error) {
    next(deleteError);
  }
};

export const createQuote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { textContent, author, image, year, school, book } = req.body;
  const { id: userId } = req.query;
  const createError = new CustomError(
    400,
    "Error creating quote",
    "We couldn't delete the quote"
  );

  try {
    const newQuote = await QuoteModel.create({
      textContent,
      author,
      owner: userId,
      book,
      image,
      school,
      year,
    });

    const userOwner = await UserModel.findById(userId);
    userOwner.quotesCreated.push(newQuote.id);
    await userOwner.save();

    res.status(201).json(newQuote);
  } catch (error) {
    createError.privateMessage = error.message;
    next(createError);
  }
};
