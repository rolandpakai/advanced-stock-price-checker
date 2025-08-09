import { Request, Response } from "express";
import { getLastNStockQuote } from "../../repositories/stockQuote";
import { getMovingAverage } from "../../services/stock";

export const getStock = async (req: Request, res: Response) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const stockData = await getLastNStockQuote(symbol, 1);
    const movingAvg = await getMovingAverage(symbol, 10);
    
    if (stockData.length === 0) {
      return res.status(404).json({ error: `No stock data found for symbol '${symbol}'` });
    }

    if (!movingAvg) {
      return res.status(404).json({ error: `No moving average data found for symbol '${symbol}'` });
    }
    
    res.json({
      symbol,
      currentPrice: stockData[0].currentPrice,
      timestamp: stockData[0].timestamp,
      movingAverage: movingAvg,
    });

  } catch (error) {
    res.status(500).json({ error: "Failed to get stock data", details: error instanceof Error ? error.message : String(error) });
  }
};
