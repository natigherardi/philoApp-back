import "./configDotenv";
import Debug from "debug";
import express from "express";
import startServer from "./server/startServer";
import connectDB from "./database";
import app from "./server";
import registerUser from "./server/controllers/usersController";
import userRouter from "./server/routers/userRouter";

const debug = Debug("philoapp:files:index");

const portNow = +process.env.PORT ?? 4000;

const urlDB = process.env.MONGO_DB;

debug("Talking from src index");

(async () => {
  try {
    await connectDB(urlDB);
    await startServer(portNow);
  } catch (error) {
    process.exit(1);
  }
})();

app.use(express.json());

app.use("/user", userRouter);
