import { validate } from "express-validation";
import express from "express";
import { loginUser, registerUser } from "../controllers/usersController";
import userDataSchema from "../schemas/userDataSchema";

const userRouter = express.Router();

userRouter.post("/register", validate(userDataSchema), registerUser);
userRouter.post("/login", loginUser);

export default userRouter;
