import { Request, Response } from "express";
import { getLastNStockQuote } from "../../repositories/stockQuote";
import { getMovingAverage } from "../../services/stock";
import { validateSymbol } from "../../utils";

export const getStock = async (req: Request, res: Response) => {
  try {
    const validatedSymbol = validateSymbol(req.params.symbol);
    const stockData = await getLastNStockQuote(validatedSymbol, 1);
    const movingAvg = await getMovingAverage(validatedSymbol, 10);
    
    if (stockData.length === 0) {
      return res.status(404).json({ error: `No stock data found for symbol '${validatedSymbol}'` });
    }

    if (!movingAvg) {
      return res.status(404).json({ error: `No moving average data found for symbol '${validatedSymbol}'` });
    }
    
    res.json({
      symbol: validatedSymbol,
      currentPrice: stockData[0].currentPrice,
      timestamp: stockData[0].timestamp,
      movingAverage: movingAvg,
    });

  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to get stock data", details: error instanceof Error ? error.message : String(error) });
  }
};
