import { StockQuote } from "@prisma/client";
import prismaClient from "../../clients/prismaClient";

export const getStockQuote = (id: number): Promise<StockQuote | null> => {
  return prismaClient.stockQuote.findUnique({
    where: { id },
  });
};
