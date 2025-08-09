import { Request, Response } from "express";
import { ScheduledTask } from "node-cron";
import { startStockQuoteFetcherJob } from "../../jobs/stockQuoteFetcher";

let activeJobs: Map<string, ScheduledTask>;

export const setActiveJobs = (jobs: Map<string, ScheduledTask>) => {
  activeJobs = jobs;
};

export const startStockJob = (req: Request, res: Response) => {
  const symbol = req.params.symbol.toUpperCase();

  if (activeJobs.has(symbol)) {
    return res.status(409).json({ message: `Scheduled job already running for ${symbol}` });
  }

  try {
    const job = startStockQuoteFetcherJob(symbol, "0 * * * * *");
    activeJobs.set(symbol, job);
    res.status(201).json({ message: `Started scheduled job for ${symbol}` });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to start scheduled job", details: error instanceof Error ? error.message : String(error) });
  }
};
