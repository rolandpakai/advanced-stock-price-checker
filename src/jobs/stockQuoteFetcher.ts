import cron, { ScheduledTask } from "node-cron";
import { fetchStockQuote } from "../services/stockService";
import { storeStockQuote } from "../repositories/stockQuote";

export const startStockQuoteFetcherJob = (symbol: string, interval = "* * * * *"): ScheduledTask => {
  if (!cron.validate(interval)) {
    throw new Error(`Invalid cron expression: ${interval}`);
  }
  
  return cron.schedule(interval, async () => {
    console.log(`[${new Date().toISOString()}] Running stock quote fetch job for ${symbol}`);

    try {
      const stockQuote = await fetchStockQuote(symbol);
      const storedStockQuote = await storeStockQuote(stockQuote);
      console.log(`Stored quote for ${symbol}: $${JSON.stringify(storedStockQuote)}`);
    } catch (error) {
      console.error(`Failed to fetch/store stock quote for ${symbol}:`, error);
    }
  });
};
