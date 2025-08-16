import { Request, Response } from "express";
import { ScheduledTask } from "node-cron";
import { startStockQuoteFetcherJob } from "../../jobs/stockQuoteFetcher";
import { validateSymbol, stockLogger } from "../../utils";

let activeJobs: Map<string, ScheduledTask>;

export const setActiveJobs = (jobs: Map<string, ScheduledTask>) => {
  activeJobs = jobs;
};

export const startStockJob = (req: Request, res: Response) => {
  try {
    const validatedSymbol = validateSymbol(req.params.symbol);

    if (activeJobs.has(validatedSymbol)) {
      stockLogger.warn({ symbol: validatedSymbol }, "Attempted to start job that is already running");
      return res.status(409).json({ message: `Scheduled job already running for ${validatedSymbol}` });
    }

    const job = startStockQuoteFetcherJob(validatedSymbol, "0 * * * * *");
    activeJobs.set(validatedSymbol, job);
    
    stockLogger.info({ 
      symbol: validatedSymbol, 
      totalActiveJobs: activeJobs.size 
    }, "Started scheduled job for symbol");
    
    res.status(201).json({ message: `Started scheduled job for ${validatedSymbol}` });
  } catch (error: unknown) {
    stockLogger.error({ 
      symbol: req.params.symbol,
      error: error instanceof Error ? error.message : String(error)
    }, "Failed to start scheduled job");
    
    res.status(500).json({ error: "Failed to start scheduled job", details: error instanceof Error ? error.message : String(error) });
  }
};
