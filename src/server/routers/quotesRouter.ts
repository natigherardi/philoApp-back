import express from "express";
import { getAllQuotes, getQuotesByUser } from "../controllers/quotesController";

const quotesRouter = express.Router();

quotesRouter.get("/all-quotes", getAllQuotes);
quotesRouter.get("/quotesByUser", getQuotesByUser);
export default quotesRouter;
