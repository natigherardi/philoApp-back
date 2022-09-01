import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDB from "../../database";
import app from "..";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoURL = mongoServer.getUri();
  await connectDB(mongoURL);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Given a users router", () => {
  describe("When it receives a request with username and name 'Natalia', and password '123'", () => {
    test.only("Then it should respond with a status 201 and an object containing the data of the req", async () => {
      const userData = { name: "john", username: "john", password: "123" };
      const message = "User was created in the database correctly";

      const { body } = await request(app)
        .post("/user/register")
        .send(userData)
        .expect(201);

      expect(body).toHaveProperty("message", message);
    });
  });

  describe("When it receives a request with empty username", () => {
    test.only("Then it should respond with a status 400 and the message 'Wrong data entered'", async () => {
      const invalidUserData = { name: "john", username: "john", password: "" };
      const expectedMessage = "Wrong data entered";

      const { body } = await request(app)
        .post("/user/register")
        .send(invalidUserData)
        .expect(400);

      expect(body).toHaveProperty("error", expectedMessage);
    });
  });
});
