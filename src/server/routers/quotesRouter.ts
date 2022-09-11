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
import imageBackUp from "../middlewares/imageBackUp/imageBackUp";

const quotesRouter = express.Router();

const uploader = multer({
  dest: path.join("uploads", "image"),
  limits: { fileSize: 800000 },
});

quotesRouter.get("/all-quotes", getAllQuotes);
quotesRouter.get("/quotesByUser", authUser, getQuotesByUser);
quotesRouter.delete("/quote", authUser, deleteQuote);
quotesRouter.post(
  "/quote",
  authUser,
  uploader.single("image"),
  imageBackUp,
  createQuote
);

export default quotesRouter;
