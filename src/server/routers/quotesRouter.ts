import express from "express";
import { getAllQuotes } from "../controllers/quotesController";

const quotesRouter = express.Router();

quotesRouter.get("/all-quotes", getAllQuotes);

export default quotesRouter;
