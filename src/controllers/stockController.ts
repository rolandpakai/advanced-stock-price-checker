import { Request, Response } from "express";
import { ScheduledTask } from "node-cron";
import { getLastNStockQuote } from "../repositories/stockQuote";
import { getMovingAverage } from "../services/stockService";
import { startStockQuoteFetcherJob } from "../jobs/stockQuoteFetcher";

const activeJobs = new Map<string, ScheduledTask>();

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

export const startStockJob = (req: Request, res: Response) => {
  const symbol = req.params.symbol.toUpperCase();

  if (activeJobs.has(symbol)) {
    return res.status(409).json({ message: `Scheduled job already running for ${symbol}` });
  }

  try {
    const job = startStockQuoteFetcherJob(symbol, "0 * * * * *");
    activeJobs.set(symbol, job);
    res.status(201).json({ message: `Started scheduled job for ${symbol}` });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to start scheduled job", details: error instanceof Error ? error.message : String(error) });
  }};

export const stopStockJob = (req: Request, res: Response) => {
  const symbol = req.params.symbol.toUpperCase();
  const task = activeJobs.get(symbol);

  if (!task) {
    return res.status(404).json({ message: `No scheduled job found for ${symbol}` });
  }

  task.stop();
  activeJobs.delete(symbol);
  res.status(200).json({ message: `Stopped scheduled job for ${symbol}` });
};
