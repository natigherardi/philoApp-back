import { NextFunction, Request, Response } from "express";
import UserModel from "../../database/models/User";
import registerUser from "./usersController";

describe("Given the users controller", () => {
  describe("When the registerUser function is called", () => {
    describe("When it's invoked, it receives a request object and the response is succesfull", () => {
      const dataUser = { user: { name: "", username: "", password: "123" } };
      const request = { body: dataUser } as Request;
      const next = () => {};

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as Partial<Response>;
      UserModel.create = jest.fn().mockResolvedValue(dataUser);

      test("Then the status method of the response should be called with 201", async () => {
        const statusOk = 201;

        await registerUser(
          request as Request,
          response as Response,
          next as NextFunction
        );

        expect(response.status).toHaveBeenCalledWith(statusOk);
      });
    });
  });
});
