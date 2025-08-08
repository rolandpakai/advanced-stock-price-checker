import cron, { ScheduledTask } from "node-cron";
import { fetchStockQuote } from "../services/stockService";
import { storeStockQuote } from "../repositories/stockQuote";

export const startStockQuoteFetcherJob = (symbol: string, interval = "0 * * * * *"): ScheduledTask => {
  return cron.schedule(interval, async () => {
    console.log(`[${new Date().toISOString()}] Running stock quote fetch job for ${symbol}`);

    try {
      const stockQuote = await fetchStockQuote(symbol);
      await storeStockQuote(stockQuote);
      console.log(`Stored quote for ${symbol}: $${stockQuote.currentPrice}`);
    } catch (error) {
      console.error(`Failed to fetch/store stock quote for ${symbol}:`, error);
    }
  });
};
