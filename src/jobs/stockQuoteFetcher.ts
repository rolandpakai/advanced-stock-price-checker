import cron, { ScheduledTask } from "node-cron";
import { fetchStockQuote } from "../services/stock";
import { storeStockQuote } from "../repositories/stockQuote";
import { jobLogger } from "../utils";

export const startStockQuoteFetcherJob = (symbol: string, interval = "* * * * *"): ScheduledTask => {
  if (!cron.validate(interval)) {
    throw new Error(`Invalid cron expression: ${interval}`);
  }
  
  return cron.schedule(interval, async () => {
    const startTime = Date.now();
    jobLogger.info({ symbol, interval }, "Starting stock quote fetch job");

    try {
      const stockQuote = await fetchStockQuote(symbol);
      const storedStockQuote = await storeStockQuote(stockQuote);
      const duration = Date.now() - startTime;
      
      jobLogger.info({ 
        symbol, 
        price: storedStockQuote.currentPrice,
        timestamp: storedStockQuote.timestamp,
        duration 
      }, "Successfully stored stock quote");
    } catch (error) {
      jobLogger.error({ 
        symbol, 
        error: error instanceof Error ? error.message : String(error),
      }, "Failed to fetch/store stock quote");
    }
  });
};
