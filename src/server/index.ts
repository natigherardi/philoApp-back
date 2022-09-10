import "../configDotenv";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./routers/userRouter";
import { generalError, notFoundError } from "./middlewares/error";
import quotesRouter from "./routers/quotesRouter";

const app = express();
app.disable("x-powered-by");

app.use(cors());
app.use(morgan("dev"));

app.use(express.json());
app.use("/user", userRouter);
app.use("/quotes", quotesRouter);
app.use(notFoundError);
app.use(generalError);

export default app;
