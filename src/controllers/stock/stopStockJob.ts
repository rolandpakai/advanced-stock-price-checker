import { Request, Response } from "express";
import { ScheduledTask } from "node-cron";

let activeJobs: Map<string, ScheduledTask>;

export const setActiveJobs = (jobs: Map<string, ScheduledTask>) => {
  activeJobs = jobs;
};

export const stopStockJob = (req: Request, res: Response) => {
  const symbol = req.params.symbol.toUpperCase();
  const task = activeJobs.get(symbol);

  if (!task) {
    return res.status(404).json({ message: `No scheduled job found for ${symbol}` });
  }

  task.stop();
  activeJobs.delete(symbol);
  res.status(200).json({ message: `Stopped scheduled job for ${symbol}` });
};
