/* eslint-disable @typescript-eslint/no-explicit-any */
import { getStockQuote } from "./getStockQuote";
import prismaClient from "../../clients/prismaClient";

jest.mock("../../clients/prismaClient", () => ({
  __esModule: true,
  default: {
    stockQuote: {
      findUnique: jest.fn(),
    },
  },
}));

const mockPrismaClient = prismaClient as any;

describe("getStockQuote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve a stock quote by id", async () => {
    const expectedQuote = {
      id: 1,
      symbol: "AAPL",
      currentPrice: 150.5,
      timestamp: new Date("2025-08-09T10:00:00.000Z"),
      createdAt: new Date("2025-08-09T10:00:00.000Z"),
    };

    mockPrismaClient.stockQuote.findUnique.mockResolvedValue(expectedQuote);

    const result = await getStockQuote(1);

    expect(result).toEqual(expectedQuote);
    expect(mockPrismaClient.stockQuote.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });

  it("should return null when stock quote not found", async () => {
    mockPrismaClient.stockQuote.findUnique.mockResolvedValue(null);

    const result = await getStockQuote(999);

    expect(result).toBeNull();
    expect(mockPrismaClient.stockQuote.findUnique).toHaveBeenCalledWith({
      where: { id: 999 },
    });
  });

  it("should handle database errors", async () => {
    const dbError = new Error("Database connection failed");
    mockPrismaClient.stockQuote.findUnique.mockRejectedValue(dbError);

    await expect(getStockQuote(1)).rejects.toThrow("Database connection failed");
    expect(mockPrismaClient.stockQuote.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
