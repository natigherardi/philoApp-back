import "../configDotenv";
import Debug from "debug";
import chalk from "chalk";
import app from ".";

const debug = Debug("philoApp:server:startServer");

debug("funciono aca");

const startServer = (port: number) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.greenBright(`Server listening on port ${port}`));
      resolve(true);
    });
    server.on("error", (error) => {
      debug(chalk.red("Error starting the server"));
      reject(error);
    });
  });

export default startServer;
