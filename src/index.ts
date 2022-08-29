import "./configDotenv";
import Debug from "debug";
import startServer from "./server/startServer";
import connectDB from "./database";

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
