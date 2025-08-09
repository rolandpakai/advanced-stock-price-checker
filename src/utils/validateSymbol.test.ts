/* eslint-disable @typescript-eslint/no-explicit-any */
import { validateSymbol } from "./validateSymbol";

describe("validateSymbol", () => {
  it("should return trimmed and uppercase symbol for valid inputs", () => {
    expect(validateSymbol("AAPL")).toBe("AAPL");
    expect(validateSymbol("aapl")).toBe("AAPL");
    expect(validateSymbol("  MSFT  ")).toBe("MSFT");
    expect(validateSymbol("brk.a")).toBe("BRK.A");
    expect(validateSymbol(" xyz ")).toBe("XYZ");
  });

  it("should throw for empty string", () => {
    expect(() => validateSymbol("")).toThrow("No symbol provided: ''");
  });

  it("should throw for null or undefined", () => {
    expect(() => validateSymbol(null as any)).toThrow("No symbol provided: 'null'");
    expect(() => validateSymbol(undefined as any)).toThrow("No symbol provided: 'undefined'");
  });

  it("should throw for whitespace-only strings", () => {
    expect(() => validateSymbol("   ")).toThrow("No symbol provided: '   '");
    expect(() => validateSymbol("\t")).toThrow("No symbol provided: '\t'");
    expect(() => validateSymbol("\n")).toThrow("No symbol provided: '\n'");
  });
});
