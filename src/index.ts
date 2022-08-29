import "./configDotenv";
import Debug from "debug";
import startServer from "./server/startServer";

const debug = Debug("philoapp:files:index");

const portNow = +process.env.PORT ?? 4000;

debug("hola");

startServer(portNow);
