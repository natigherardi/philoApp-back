import express from "express";
import {
  createQuote,
  deleteQuote,
  getAllQuotes,
  getQuotesByUser,
} from "../controllers/quotesController";
import authUser from "../middlewares/authUser";

const quotesRouter = express.Router();

quotesRouter.get("/all-quotes", getAllQuotes);
quotesRouter.get("/quotesByUser", authUser, getQuotesByUser);
quotesRouter.delete("/quote", authUser, deleteQuote);
quotesRouter.post("/quote", authUser, createQuote);

export default quotesRouter;
