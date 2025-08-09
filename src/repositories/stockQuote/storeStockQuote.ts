import { StockQuote } from "@prisma/client";
import { StockQuoteDTO } from "../../models/stockQuote.dto";
import prismaClient from "../../clients/prismaClient";

export const storeStockQuote = (stockQuote: StockQuoteDTO): Promise<StockQuote> => {
  return prismaClient.stockQuote.create({
    data: {
      symbol: stockQuote.symbol,
      currentPrice: stockQuote.currentPrice,
      timestamp: stockQuote.timestamp,
    },
  });
};
