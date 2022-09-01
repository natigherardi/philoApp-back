import "../configDotenv";
import express from "express";
import userRouter from "./routers/userRouter";
import { generalError, notFoundError } from "./middlewares/error";

const app = express();
app.disable("x-powered-by");

app.use(express.json());

app.use("/user", userRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
