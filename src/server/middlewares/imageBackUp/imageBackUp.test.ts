import { NextFunction, Request, Response } from "express";
import imageBackUp from "./imageBackUp";

jest.mock("fs");
const uploadMocked = {};

jest.mock("@supabase/supabase-js", () => ({
  ...jest.requireActual("@supabase/supabase-js"),

  createClient: () => ({
    storage: {
      from: () => ({
        upload: () => uploadMocked,
        getPublicUrl: () => "mockUrl",
      }),
    },
  }),
}));

jest.mock("fs/promises", () => ({
  ...jest.requireActual("fs/promises"),
  rename: jest.fn(),
  readFile: jest.fn().mockResolvedValue(""),
}));

const request = {
  body: {},
  file: { originalname: "mock-image", filename: "mock-file" },
} as Partial<Request>;
const response = {
  status: jest.fn(),
  json: jest.fn().mockReturnThis(),
} as Partial<Response>;
const next = jest.fn();

describe("Given the imageBackUp middleware", () => {
  describe("When it receives a request with a file", () => {
    test("Then it should call the enxt method", async () => {
      await imageBackUp(
        request as Request,
        response as Response,
        next as NextFunction
      );

      await expect(next).toHaveBeenCalled();
      await expect(next).not.toHaveBeenCalledWith(Error);
    });
  });
});
