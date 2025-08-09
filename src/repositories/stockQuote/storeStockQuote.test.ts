/* eslint-disable @typescript-eslint/no-explicit-any */
import { storeStockQuote } from "./storeStockQuote";
import prismaClient from "../../clients/prismaClient";
import { StockQuoteDTO } from "../../models/stockQuote.dto";

jest.mock("../../clients/prismaClient", () => ({
  __esModule: true,
  default: {
    stockQuote: {
      create: jest.fn(),
    },
  },
}));

const mockPrismaClient = prismaClient as any;

describe("storeStockQuote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should store a stock quote successfully", async () => {
    const stockQuoteDTO: StockQuoteDTO = {
      symbol: "AAPL",
      currentPrice: 150.5,
      timestamp: new Date("2025-08-09T10:00:00.000Z"),
    };

    const expectedStoredQuote = {
      id: 1,
      symbol: "AAPL",
      currentPrice: 150.5,
      timestamp: new Date("2025-08-09T10:00:00.000Z"),
      createdAt: new Date("2025-08-09T10:00:00.000Z"),
    };

    mockPrismaClient.stockQuote.create.mockResolvedValue(expectedStoredQuote);

    const result = await storeStockQuote(stockQuoteDTO);

    expect(result).toEqual(expectedStoredQuote);
    expect(mockPrismaClient.stockQuote.create).toHaveBeenCalledWith({
      data: {
        symbol: "AAPL",
        currentPrice: 150.5,
        timestamp: new Date("2025-08-09T10:00:00.000Z"),
      },
    });
  });

  it("should handle database errors", async () => {
    const stockQuoteDTO: StockQuoteDTO = {
      symbol: "AAPL",
      currentPrice: 150.5,
      timestamp: new Date("2025-08-09T10:00:00.000Z"),
    };

    const dbError = new Error("Database connection failed");
    mockPrismaClient.stockQuote.create.mockRejectedValue(dbError);

    await expect(storeStockQuote(stockQuoteDTO)).rejects.toThrow("Database connection failed");
    expect(mockPrismaClient.stockQuote.create).toHaveBeenCalledWith({
      data: {
        symbol: "AAPL",
        currentPrice: 150.5,
        timestamp: new Date("2025-08-09T10:00:00.000Z"),
      },
    });
  });
});
