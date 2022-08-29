import chalk from "chalk";
import Debug from "debug";
import mongoose from "mongoose";

const debug = Debug("philoapp:database");

const connectDB = (dbUrl: string) => {
  mongoose.connect(dbUrl, (error) => {
    if (error) {
      debug(chalk.red("Error connecting to database"));
    }

    debug(chalk.green("Connected to database"));
  });
};

export default connectDB;
