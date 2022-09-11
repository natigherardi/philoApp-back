import express from "express";
import multer from "multer";
import path from "path";
import {
  createQuote,
  deleteQuote,
  getAllQuotes,
  getQuotesByUser,
} from "../controllers/quotesController";
import authUser from "../middlewares/authUser";

const quotesRouter = express.Router();

const uploader = multer({
  dest: path.join("uploads", "img"),
  limits: { fileSize: 800000 },
});

quotesRouter.get("/all-quotes", getAllQuotes);
quotesRouter.get("/quotesByUser", authUser, getQuotesByUser);
quotesRouter.delete("/quote", authUser, deleteQuote);
quotesRouter.post("/quote", authUser, uploader.single("image"), createQuote);

export default quotesRouter;
