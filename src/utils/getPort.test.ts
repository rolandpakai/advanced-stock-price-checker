import { getPort } from "./getPort";
import { DEFAULT_PORT } from "../defaults";

describe("getPort", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should return the default port when PORT environment variable is not set", () => {
    delete process.env.PORT;
    
    const port = getPort();
    
    expect(port).toBe(DEFAULT_PORT);
    expect(port).toBe(9000);
  });

  it("should return the port from environment variable when PORT is set", () => {
    process.env.PORT = "9000";
    
    const port = getPort();
    
    expect(port).toBe(9000);
  });

  it("should return default port when PORT environment variable is empty string", () => {
    process.env.PORT = "";
    
    const port = getPort();
    
    expect(port).toBe(DEFAULT_PORT);
  });

  it("should return the correct type (number)", () => {
    process.env.PORT = "9000";
    
    const port = getPort();
    
    expect(typeof port).toBe("number");
    expect(port).toBe(9000);
  });
});
