/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateSymbol } from "./validateSymbol";

describe("validateSymbol", () => {
  it("should return trimmed and uppercase symbol for valid inputs", () => {
    expect(validateSymbol("AAPL")).toBe("AAPL");
    expect(validateSymbol("aapl")).toBe("AAPL");
  });

  it("should throw for empty string", () => {
    expect(() => validateSymbol("")).toThrow("No symbol provided: ''");
  });

  it("should throw for null or undefined", () => {
    expect(() => validateSymbol(null as any)).toThrow("No symbol provided: 'null'");
    expect(() => validateSymbol(undefined as any)).toThrow("No symbol provided: 'undefined'");
  });
});
