import { NextFunction, Request, Response } from "express";
import UserModel from "../../database/models/User";
import registerUser from "./usersController";

describe("Given the users controller", () => {
  describe("When the registerUser function is called", () => {
    describe("When it's invoked, it receives a request object and the response is succesfull", () => {
      const dataUser = { name: "", username: "", password: "123" };
      const request = { body: dataUser } as Request;
      const next = () => {};
      let response: Partial<Response>;
      beforeEach(async () => {
        response = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        } as Partial<Response>;
        UserModel.create = jest.fn().mockResolvedValue(dataUser);
        await registerUser(
          request as Request,
          response as Response,
          next as NextFunction
        );
      });

      test("Then the status method of the response should be called with 201", async () => {
        const statusOk = 201;

        expect(response.status).toHaveBeenCalledWith(statusOk);
      });

      test("And then the json method of the response should be called with a user object", async () => {
        expect(response.json).toHaveBeenCalledWith({ user: dataUser });
      });
    });

    describe("And when the response is unsuccessfull", () => {
      test("Then the next function should be called with an error", async () => {
        const dataUser = { username: "", password: "123" };
        const request = { body: dataUser } as Request;
        const next = jest.fn();
        const response = {} as Partial<Response>;
        const error = new Error();
        UserModel.create = jest.fn().mockRejectedValue(error);
        await registerUser(
          request as Request,
          response as Response,
          next as NextFunction
        );

        expect(next).toHaveBeenCalledWith(error);
      });
    });
  });
});
