import { Request, Response } from "express";
import { getLastNStockQuote } from "../../repositories/stockQuote";
import { calculateAverage, validateSymbol, stockLogger } from "../../utils";

export const getStock = async (req: Request, res: Response) => {
  try {
    const validatedSymbol = validateSymbol(req.params.symbol);
    const stockData = await getLastNStockQuote(validatedSymbol, 10);
    
    if (stockData.length === 0) {
      stockLogger.warn({ symbol: validatedSymbol }, "No stock data found for symbol");
      return res.status(404).json({ error: `No stock data found for symbol '${validatedSymbol}'` });
    }

    const { currentPrice, timestamp } = stockData[0];
    const currentPrices = stockData.map(sq => sq.currentPrice);
    const movingAverage = calculateAverage(currentPrices);

    stockLogger.info({ 
      symbol: validatedSymbol, 
      currentPrice, 
      movingAverage,
    }, "Retrieved stock data successfully");

    res.json({
      symbol: validatedSymbol,
      currentPrice,
      timestamp,
      movingAverage,
    });

  } catch (error: unknown) {
    stockLogger.error({ 
      symbol: req.params.symbol,
      error: error instanceof Error ? error.message : String(error)
    }, "Failed to get stock data");
    
    res.status(500).json({ error: "Failed to get stock data", details: error instanceof Error ? error.message : String(error) });
  }
};
