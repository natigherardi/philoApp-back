import chalk from "chalk";
import Debug from "debug";
import mongoose from "mongoose";

const debug = Debug("philoapp:database");

const connectDB = (dbUrl: string) => {
  // eslint-disable-next-line no-new
  new Promise((resolve, reject) => {
    mongoose.connect(dbUrl, (error) => {
      if (error) {
        debug(chalk.red("Error connecting to database"));
        reject(error);
      }

      debug(chalk.greenBright("Connected to database"));
      resolve(true);
    });
  });
};

export default connectDB;
