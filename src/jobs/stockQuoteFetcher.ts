import cron from "node-cron";
import { fetchStockQuote } from "../services/stockService";
import { saveStockQuote } from "../repositories/stockQuote";

export const startStockQuoteFetcherJob = (symbol: string, interval = "0 * * * * *") => {
  cron.schedule(interval, async () => {
    console.log(`[${new Date().toISOString()}] Running stock quote fetch job for ${symbol}`);

    try {
      const stockQuote = await fetchStockQuote(symbol);
      await saveStockQuote(stockQuote);
      console.log(`Saved quote for ${symbol}: $${stockQuote.currentPrice}`);
    } catch (error) {
      console.error(`Failed to fetch/save stock quote for ${symbol}:`, error);
    }
  });
};
