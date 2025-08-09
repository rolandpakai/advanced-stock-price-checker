import z from "zod";
import { RequiredError } from "finnhub-ts/dist/base";
import finnhubClient from "../../clients/finnhubClient";
import { StockQuoteDTO } from "../../models/stockQuote.dto";
import { QuoteSchema } from "../../schemas";

export const fetchStockQuote = async (symbol: string): Promise<StockQuoteDTO> => {   
  try {
    const response = await finnhubClient.quote(symbol);
    const data = QuoteSchema.parse(response.data);

    if (data.c === undefined) {
      throw new Error(`Undefined current price received from Finnhub API for symbol '${symbol}'`);
    }

    return {
      symbol,
      currentPrice: data.c,
      timestamp: new Date(),
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