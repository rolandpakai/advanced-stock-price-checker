/* eslint-disable @typescript-eslint/no-explicit-any */
import { fetchStockQuote } from "./fetchStockQuote";
import finnhubClient from "../../clients/finnhubClient";
import { RequiredError } from "finnhub-ts/dist/base";

jest.mock("../../clients/finnhubClient");
const mockFinnhubClient = finnhubClient as jest.Mocked<typeof finnhubClient>;

describe("fetchStockQuote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset Date.now to ensure consistent timestamps in tests
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-08-09T10:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should successfully fetch and return stock quote", async () => {
    const mockResponse = {
      data: {
        c: 150.5,
        o: 149.0,
        h: 151.0,
        l: 148.5,
        pc: 149.5,
        d: 1.0,
        dp: 0.67
      }
    } as any;
    mockFinnhubClient.quote.mockResolvedValue(mockResponse);

    const result = await fetchStockQuote("AAPL");

    expect(result).toEqual({
      symbol: "AAPL",
      currentPrice: 150.5,
      timestamp: new Date("2025-08-09T10:00:00.000Z")
    });
    expect(mockFinnhubClient.quote).toHaveBeenCalledWith("AAPL");
  });

  it("should throw error when current price is undefined", async () => {
    const mockResponse = {
      data: {
        o: 149.0,
        h: 151.0,
        l: 148.5,
        pc: 149.5,
        d: 1.0,
        dp: 0.67
        // c is missing/undefined
      }
    } as any;
    mockFinnhubClient.quote.mockResolvedValue(mockResponse);

    await expect(fetchStockQuote("AAPL")).rejects.toThrow(
      "Undefined current price received from Finnhub API for symbol 'AAPL'"
    );
    expect(mockFinnhubClient.quote).toHaveBeenCalledWith("AAPL");
  });

  it("should handle ZodError for invalid symbol", async () => {
    const mockResponse = {
      data: {
        c: 0,
        o: 0,
        h: 0,
        l: 0,
        pc: 0,
        d: null,
        dp: null
      }
    } as any;
    mockFinnhubClient.quote.mockResolvedValue(mockResponse);

    await expect(fetchStockQuote("XYZ")).rejects.toThrow(
      "Invalid data format received from Finnhub API for symbol 'XYZ'"
    );
    expect(mockFinnhubClient.quote).toHaveBeenCalledWith("XYZ");
  });

  it("should handle ZodError for no symbol", async () => {
    const mockResponse = {
      data: {
        c: 0,
        o: 0,
        h: 0,
        l: 0,
        pc: 0,
        d: null,
        dp: null
      }
    } as any;
    mockFinnhubClient.quote.mockResolvedValue(mockResponse);

    await expect(fetchStockQuote("")).rejects.toThrow(
      "Invalid data format received from Finnhub API for symbol ''"
    );
    expect(mockFinnhubClient.quote).toHaveBeenCalledWith("");
  });

  it("should handle ZodError for invalid data format", async () => {
    const mockResponse = {
      data: {
        c: "invalid_number", // This should cause a ZodError
        o: 149.0
      }
    } as any;
    mockFinnhubClient.quote.mockResolvedValue(mockResponse);

    await expect(fetchStockQuote("AAPL")).rejects.toThrow(
      "Invalid data format received from Finnhub API for symbol 'AAPL'"
    );
    expect(mockFinnhubClient.quote).toHaveBeenCalledWith("AAPL");
  });

  it("should handle RequiredError from finnhub client", async () => {
    const requiredError = new RequiredError("Missing required parameter");
    mockFinnhubClient.quote.mockRejectedValue(requiredError);

    await expect(fetchStockQuote("INVALID")).rejects.toThrow(
      "Invalid request parameters for symbol 'INVALID':"
    );
    expect(mockFinnhubClient.quote).toHaveBeenCalledWith("INVALID");
  });

  it("should handle generic Error", async () => {
    const genericError = new Error("Network timeout");
    mockFinnhubClient.quote.mockRejectedValue(genericError);

    await expect(fetchStockQuote("AAPL")).rejects.toThrow(
      "Failed to fetch stock price for AAPL: Network timeout"
    );
    expect(mockFinnhubClient.quote).toHaveBeenCalledWith("AAPL");
  });

  it("should return correct data types", async () => {
    const mockResponse = {
      data: {
        c: 150.5,
        o: 149.0
      }
    } as any;
    mockFinnhubClient.quote.mockResolvedValue(mockResponse);

    const result = await fetchStockQuote("AAPL");

    expect(typeof result.symbol).toBe("string");
    expect(typeof result.currentPrice).toBe("number");
    expect(result.timestamp).toBeInstanceOf(Date);
  });
});
