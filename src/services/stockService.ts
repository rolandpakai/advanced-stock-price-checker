import { finnhubClient } from "../clients/finnhubClient";
import { RequiredError } from "finnhub-ts/dist/base";
import { z } from "zod";

const QuoteSchema = z.object({
  c: z.number().optional(),
  o: z.number().optional(),
  h: z.number().optional(),
  l: z.number().optional(),
  pc: z.number().optional(),
  d: z.number().optional(),
  dp: z.number().optional(),
});

export type StockQuote = {
  symbol: string;
  currentPrice: number | undefined;
  timestamp: number;
};

export const fetchStockPrice = async (symbol: string): Promise<StockQuote> => {   
  try {
    const response = await finnhubClient.quote(symbol);
    const data = QuoteSchema.parse(response.data);

    return {
      symbol,
      currentPrice: data.c,
      timestamp: Date.now(),
    };
  } catch (error: unknown) {
    if (error instanceof RequiredError) {
      throw new Error(`Invalid request parameters for symbol '${symbol}': ${error.message}`);
    }
    if (error instanceof z.ZodError) {
      throw new Error(`Invalid data format received from Finnhub API for symbol '${symbol}'`);
    }
    if (error instanceof Error) {
      throw new Error(`Failed to fetch stock price for ${symbol}: ${error.message}`);
    }
    throw new Error(`Failed to fetch stock price for ${symbol} due to unknown error`);
  }
};
