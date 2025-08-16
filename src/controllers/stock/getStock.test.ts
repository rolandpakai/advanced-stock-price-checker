import { Request, Response } from "express";
import { StockQuote } from "@prisma/client";
import { getStock } from "./getStock";
import { getLastNStockQuote } from "../../repositories/stockQuote";

jest.mock("../../repositories/stockQuote");

const mockGetLastNStockQuote = getLastNStockQuote as jest.MockedFunction<typeof getLastNStockQuote>;

describe("getStock Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {
      params: { symbol: "AAPL" }
    };
    
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    jest.clearAllMocks();
  });

  it("should return stock data successfully", async () => {
    const mockStockData: StockQuote[] = [
      {
        id: 1,
        symbol: "AAPL",
        currentPrice: 150.25,
        timestamp: new Date("2025-08-09T10:00:00Z"),
        createdAt: new Date("2025-08-09T10:00:00Z")
      },
      {
        id: 2,
        symbol: "AAPL",
        currentPrice: 149.75,
        timestamp: new Date("2025-08-09T09:00:00Z"),
        createdAt: new Date("2025-08-09T09:00:00Z")
      }
    ];

    mockGetLastNStockQuote.mockResolvedValue(mockStockData);

    await getStock(req as Request, res as Response);

    expect(mockGetLastNStockQuote).toHaveBeenCalledWith("AAPL", 10);
    expect(res.json).toHaveBeenCalledWith({
      symbol: "AAPL",
      currentPrice: 150.25,
      timestamp: mockStockData[0].timestamp,
      movingAverage: 150 // (150.25 + 149.75) / 2 = 150
    });
  });

  it("should convert symbol to uppercase", async () => {
    req.params = { symbol: "aapl" };
    
    const mockStockData: StockQuote[] = [
      { 
        id: 1, 
        symbol: "AAPL", 
        currentPrice: 150.25, 
        timestamp: new Date(),
        createdAt: new Date()
      }
    ];
    
    mockGetLastNStockQuote.mockResolvedValue(mockStockData);

    await getStock(req as Request, res as Response);

    expect(mockGetLastNStockQuote).toHaveBeenCalledWith("AAPL", 10);
  });

  it("should return 404 when no stock data found", async () => {
    mockGetLastNStockQuote.mockResolvedValue([]);

    await getStock(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "No stock data found for symbol 'AAPL'"
    });
  });

  it("should handle repository errors", async () => {
    const error = new Error("Database connection failed");
    mockGetLastNStockQuote.mockRejectedValue(error);

    await getStock(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to get stock data",
      details: "Database connection failed"
    });
  });
});
