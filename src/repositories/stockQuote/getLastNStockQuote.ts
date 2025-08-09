import { StockQuote } from "@prisma/client";
import prismaClient from "../../clients/prismaClient";

export async function getLastNStockQuote(symbol: string, limit: number = 10): Promise<StockQuote[]> {
  return prismaClient.stockQuote.findMany({
    where: { symbol },
    orderBy: { timestamp: "desc" },
    take: limit,
  });
}
