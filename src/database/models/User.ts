import { model, Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, require: true },
  username: { type: String, require: true, unique: true },
  password: { type: String, require: true },
  quotes: [],
});

const UserModel = model("User", userSchema, "users");

export default UserModel;
