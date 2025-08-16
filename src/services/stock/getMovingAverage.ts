import { getLastNStockQuote } from "../../repositories/stockQuote";
import { calculateAverage } from "../../utils";

export async function getMovingAverage(symbol: string, limit: number = 10): Promise<number | null> {
  const stockQuotes = await getLastNStockQuote(symbol, limit);

  if (stockQuotes.length === 0) {
    return null;
  }

  const currentPrices = stockQuotes.map(sq => sq.currentPrice);
  const avg = calculateAverage(currentPrices);

  return Number(avg.toFixed(2));
}