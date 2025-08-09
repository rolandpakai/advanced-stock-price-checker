import { getMovingAverage } from "./getMovingAverage";
import { getLastNStockQuote } from "../../repositories/stockQuote";

jest.mock("../../repositories/stockQuote");
const mockGetLastNStockQuote = getLastNStockQuote as jest.MockedFunction<typeof getLastNStockQuote>;

describe("getMovingAverage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return null when no stock quotes are found", async () => {
    mockGetLastNStockQuote.mockResolvedValue([]);

    const result = await getMovingAverage("AAPL", 10);

    expect(result).toBeNull();
    expect(mockGetLastNStockQuote).toHaveBeenCalledWith("AAPL", 10);
  });

  it("should calculate moving average for single stock quote", async () => {
    const mockQuotes = [
      {
        id: 1,
        symbol: "AAPL",
        currentPrice: 150.5,
        timestamp: new Date(),
        createdAt: new Date()
      }
    ];
    mockGetLastNStockQuote.mockResolvedValue(mockQuotes);

    const result = await getMovingAverage("AAPL", 1);

    expect(result).toBe(150.5);
    expect(mockGetLastNStockQuote).toHaveBeenCalledWith("AAPL", 1);
  });

  it("should calculate moving average for multiple stock quotes", async () => {
    const mockQuotes = [
      {
        id: 1,
        symbol: "AAPL",
        currentPrice: 100,
        timestamp: new Date(),
        createdAt: new Date()
      },
      {
        id: 2,
        symbol: "AAPL",
        currentPrice: 200,
        timestamp: new Date(),
        createdAt: new Date()
      },
      {
        id: 3,
        symbol: "AAPL",
        currentPrice: 150,
        timestamp: new Date(),
        createdAt: new Date()
      }
    ];
    mockGetLastNStockQuote.mockResolvedValue(mockQuotes);

    const result = await getMovingAverage("AAPL", 3);

    expect(result).toBe(150);
    expect(mockGetLastNStockQuote).toHaveBeenCalledWith("AAPL", 3);
  });

  it("should use default limit of 10 when not specified", async () => {
    const mockQuotes = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      symbol: "AAPL",
      currentPrice: 100 + i,
      timestamp: new Date(),
      createdAt: new Date()
    }));
    mockGetLastNStockQuote.mockResolvedValue(mockQuotes);

    const result = await getMovingAverage("AAPL");

    expect(result).toBe(104.5);
    expect(mockGetLastNStockQuote).toHaveBeenCalledWith("AAPL", 10);
  });

  it("should return correct type (number or null)", async () => {
    // Test null case
    mockGetLastNStockQuote.mockResolvedValue([]);
    const nullResult = await getMovingAverage("AAPL");
    expect(nullResult).toBeNull();

    // Test number case
    const mockQuotes = [
      {
        id: 1,
        symbol: "AAPL",
        currentPrice: 150,
        timestamp: new Date(),
        createdAt: new Date()
      }
    ];
    mockGetLastNStockQuote.mockResolvedValue(mockQuotes);
    const numberResult = await getMovingAverage("AAPL");
    expect(typeof numberResult).toBe("number");
  });
});
