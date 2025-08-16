import { Request, Response } from "express";
import { ScheduledTask } from "node-cron";
import { validateSymbol, stockLogger } from "../../utils";

let activeJobs: Map<string, ScheduledTask>;

export const setActiveJobs = (jobs: Map<string, ScheduledTask>) => {
  activeJobs = jobs;
};

export const stopStockJob = (req: Request, res: Response) => {
  try {
    const validatedSymbol = validateSymbol(req.params.symbol);
    const task = activeJobs.get(validatedSymbol);

    if (!task) {
      stockLogger.warn({ symbol: validatedSymbol }, "Attempted to stop job that doesn't exist");
      return res.status(404).json({ message: `No scheduled job found for ${validatedSymbol}` });
    }

    task.stop();
    activeJobs.delete(validatedSymbol);
    
    stockLogger.info({ 
      symbol: validatedSymbol, 
      totalActiveJobs: activeJobs.size 
    }, "Stopped scheduled job for symbol");
    
    res.status(200).json({ message: `Stopped scheduled job for ${validatedSymbol}` });
  } catch (error: unknown) {
    stockLogger.error({ 
      symbol: req.params.symbol,
      error: error instanceof Error ? error.message : String(error)
    }, "Failed to stop scheduled job");
    
    res.status(500).json({ error: "Failed to stop scheduled job", details: error instanceof Error ? error.message : String(error) });
  }
};
