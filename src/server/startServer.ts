import "../configDotenv";
import Debug from "debug";
import chalk from "chalk";
import app from ".";
import CustomError from "../utils/CustomError";

const debug = Debug("philoapp:server:startServer");

const startServer = (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.greenBright(`Server listening on port ${port}`));
      resolve(true);
    });
    server.on("error", (error: CustomError) => {
      if (error.code === "EADDRINUSE") {
        debug(chalk.red(`Port ${port} in use`));
      }
      debug(chalk.red("Error starting the server"));
      reject(error);
    });
  });

export default startServer;
