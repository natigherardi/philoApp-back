import JwtPayload from "../../interfaces/JwtPayload";
import {
  createToken,
  hashCompare,
  hashCreator,
  verifyToken,
} from "./authenticate";
import jwt from "jsonwebtoken";

const mockJwtSign = jest.fn().mockReturnValue("tokenMock");
const mockJwtVerify = jest.fn().mockReturnValue("verifyMock");

jest.mock("jsonwebtoken", () => ({
  sign: (payload: JwtPayload) => mockJwtSign(payload),
  verify: (token: string) => mockJwtVerify(token),
}));

describe("Given a hashCreator function", () => {
  describe("When its called with a text", () => {
    test("Then it should return a hash", async () => {
      const mockPassword = "passwordTest";
      const expectedCharacteristics = { hashBegin: true, hashLength: 60 };

      const resultedHash = await hashCreator(mockPassword);
      const hashCharacteristics = {
        hashBegin: resultedHash.startsWith("$2b$10$"),
        hashLength: resultedHash.length,
      };

      expect(hashCharacteristics).toStrictEqual(expectedCharacteristics);
    });
  });
});

describe("Given a hashCompare function", () => {
  describe("When its called with a text and a hash", () => {
    test("Then it should return true", async () => {
      const text = "";
      const hash = await hashCreator(text);

      const result = await hashCompare(text, hash);

      expect(result).toBeTruthy();
    });
  });
});

describe("Given a create token function", () => {
  describe("When its called with a payload", () => {
    test("then it should call jwt sign method and return the creted token", () => {
      const payload = {
        id: "",
        username: "",
      };

      const expectedToken = createToken(payload);

      expect(mockJwtSign).toHaveBeenCalled();
      expect(expectedToken).toStrictEqual("tokenMock");
    });
  });
});

describe("Given a verify token function", () => {
  describe("When its called with a token", () => {
    test("then it should call jwt verify method with the received token", () => {
      const mockToken = "123";

      const result = verifyToken(mockToken);
      const expectedResult = "verifyMock";

      expect(mockJwtVerify).toHaveBeenCalled();
      expect(result).toBe(expectedResult);
    });
  });
});
