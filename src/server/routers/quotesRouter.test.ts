import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDB from "../../database";
import app from "..";
import QuoteModel from "../../database/models/Quote";
import Quote from "../../interfaces/Quote";

let mongoServer: MongoMemoryServer;

const mockQuote: Quote = {
  author: "test",
  image: "test",
  textContent: "test",
  user: "test",
};

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoURL = mongoServer.getUri();
  await connectDB(mongoURL);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
  QuoteModel.deleteMany();
});

describe("Given a quotes router", () => {
  describe("When it receives a get request to endpoint '/all-quotes'", () => {
    test("Then it should respond with a status 201", async () => {
      await QuoteModel.create(mockQuote);

      await request(app).get("/quotes/all-quotes").expect(200);
    });
  });
});
