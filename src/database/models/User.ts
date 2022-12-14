import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  quotesCreated: [{ type: Schema.Types.ObjectId, ref: "Quote" }],
  quotesFavorited: [{ type: Schema.Types.ObjectId, ref: "Quote" }],
});

const UserModel = model("User", userSchema, "users");

export default UserModel;
