import { model, Schema } from "mongoose";

const quoteSchema = new Schema({
  textContent: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  year: { type: String },
  school: { type: String },
  book: { type: String },
});

const QuoteModel = model("Quote", quoteSchema, "quotes");

export default QuoteModel;
