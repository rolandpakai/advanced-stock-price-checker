import { Request, Response } from "express";
import { ScheduledTask } from "node-cron";
import { validateSymbol } from "../../utils";

let activeJobs: Map<string, ScheduledTask>;

export const setActiveJobs = (jobs: Map<string, ScheduledTask>) => {
  activeJobs = jobs;
};

export const stopStockJob = (req: Request, res: Response) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const validatedSymbol = validateSymbol(symbol);
    const task = activeJobs.get(validatedSymbol);

    if (!task) {
      return res.status(404).json({ message: `No scheduled job found for ${validatedSymbol}` });
    }

    task.stop();
    activeJobs.delete(validatedSymbol);
    res.status(200).json({ message: `Stopped scheduled job for ${validatedSymbol}` });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to stop scheduled job", details: error instanceof Error ? error.message : String(error) });
  }
};
