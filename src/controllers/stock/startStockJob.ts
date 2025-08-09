import { Request, Response } from "express";
import { ScheduledTask } from "node-cron";
import { startStockQuoteFetcherJob } from "../../jobs/stockQuoteFetcher";
import { validateSymbol } from "../../utils";

let activeJobs: Map<string, ScheduledTask>;

export const setActiveJobs = (jobs: Map<string, ScheduledTask>) => {
  activeJobs = jobs;
};

export const startStockJob = (req: Request, res: Response) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const validatedSymbol = validateSymbol(symbol);

    if (activeJobs.has(validatedSymbol)) {
      return res.status(409).json({ message: `Scheduled job already running for ${symbol}` });
    }

    const job = startStockQuoteFetcherJob(validatedSymbol, "0 * * * * *");
    activeJobs.set(validatedSymbol, job);
    res.status(201).json({ message: `Started scheduled job for ${validatedSymbol}` });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to start scheduled job", details: error instanceof Error ? error.message : String(error) });
  }
};
