/* eslint-disable @typescript-eslint/no-explicit-any */
import { getLastNStockQuote } from "./getLastNStockQuote";
import prismaClient from "../../clients/prismaClient";

jest.mock("../../clients/prismaClient", () => ({
  __esModule: true,
  default: {
    stockQuote: {
      findMany: jest.fn(),
    },
  },
}));

const mockPrismaClient = prismaClient as any;

describe("getLastNStockQuote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve last N stock quotes for a symbol", async () => {
    const expectedQuotes = [
      {
        id: 3,
        symbol: "AAPL",
        currentPrice: 152.0,
        timestamp: new Date("2025-08-09T12:00:00.000Z"),
        createdAt: new Date("2025-08-09T12:00:00.000Z"),
      },
      {
        id: 2,
        symbol: "AAPL",
        currentPrice: 151.0,
        timestamp: new Date("2025-08-09T11:00:00.000Z"),
        createdAt: new Date("2025-08-09T11:00:00.000Z"),
      },
      {
        id: 1,
        symbol: "AAPL",
        currentPrice: 150.0,
        timestamp: new Date("2025-08-09T10:00:00.000Z"),
        createdAt: new Date("2025-08-09T10:00:00.000Z"),
      },
    ];

    mockPrismaClient.stockQuote.findMany.mockResolvedValue(expectedQuotes);

    const result = await getLastNStockQuote("AAPL", 3);

    expect(result).toEqual(expectedQuotes);
    expect(mockPrismaClient.stockQuote.findMany).toHaveBeenCalledWith({
      where: { symbol: "AAPL" },
      orderBy: { timestamp: "desc" },
      take: 3,
    });
  });

  it("should use default limit of 10 when not specified", async () => {
    const expectedQuotes = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      symbol: "AAPL",
      currentPrice: 150 + i,
      timestamp: new Date(`2025-08-09T${10 + i}:00:00.000Z`),
      createdAt: new Date(`2025-08-09T${10 + i}:00:00.000Z`),
    }));

    mockPrismaClient.stockQuote.findMany.mockResolvedValue(expectedQuotes);

    const result = await getLastNStockQuote("AAPL");

    expect(result).toEqual(expectedQuotes);
    expect(mockPrismaClient.stockQuote.findMany).toHaveBeenCalledWith({
      where: { symbol: "AAPL" },
      orderBy: { timestamp: "desc" },
      take: 10,
    });
  });

  it("should return empty array when no quotes found", async () => {
    mockPrismaClient.stockQuote.findMany.mockResolvedValue([]);

    const result = await getLastNStockQuote("NONEXISTENT", 5);

    expect(result).toEqual([]);
    expect(mockPrismaClient.stockQuote.findMany).toHaveBeenCalledWith({
      where: { symbol: "NONEXISTENT" },
      orderBy: { timestamp: "desc" },
      take: 5,
    });
  });

  it("should handle database errors", async () => {
    const dbError = new Error("Database connection failed");
    mockPrismaClient.stockQuote.findMany.mockRejectedValue(dbError);

    await expect(getLastNStockQuote("AAPL", 5)).rejects.toThrow("Database connection failed");
    expect(mockPrismaClient.stockQuote.findMany).toHaveBeenCalledWith({
      where: { symbol: "AAPL" },
      orderBy: { timestamp: "desc" },
      take: 5,
    });
  });
});
