import { getLastNStockQuote } from "../../repositories/stockQuote";

export async function getMovingAverage(symbol: string, limit: number = 10): Promise<number | null> {
  const stockQuotes = await getLastNStockQuote(symbol, limit);

  if (stockQuotes.length === 0) {
    return null;
  }

  const sum = stockQuotes.reduce((acc, sq) => acc + sq.currentPrice, 0);
  const avg = sum / stockQuotes.length;

  return Number(avg.toFixed(2));
}