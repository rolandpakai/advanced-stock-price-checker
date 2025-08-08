import { StockQuote } from "@prisma/client/wasm";
import { StockQuoteDTO } from "../models/stockQuote.dto";
import prismaClient from "../clients/prismaClient";

export const saveStockQuote = (stockQuote: StockQuoteDTO): Promise<StockQuote> => {
  return prismaClient.stockQuote.create({
    data: {
      symbol: stockQuote.symbol,
      price: stockQuote.currentPrice,
      timestamp: stockQuote.timestamp,
    },
  });
};

export const getStockQuote = (id: number): Promise<StockQuote | null> => {
  return prismaClient.stockQuote.findUnique({
    where: { id },
  });
};
