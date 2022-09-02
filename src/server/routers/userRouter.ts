import express from "express";
import { validate } from "express-validation";
import { registerUser } from "../controllers/usersController";
import userDataSchema from "../schemas/userDataSchema";

const userRouter = express.Router();

userRouter.post("/register", validate(userDataSchema), registerUser);

export default userRouter;
