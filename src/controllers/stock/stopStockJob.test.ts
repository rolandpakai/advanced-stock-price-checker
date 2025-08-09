import { Request, Response } from "express";
import { ScheduledTask } from "node-cron";
import { stopStockJob, setActiveJobs } from "./stopStockJob";

describe("stopStockJob Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let activeJobs: Map<string, ScheduledTask>;
  let mockJob: Partial<ScheduledTask>;

  beforeEach(() => {
    req = {
      params: { symbol: "AAPL" }
    };
    
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis()
    };

    activeJobs = new Map();
    setActiveJobs(activeJobs);

    mockJob = {
      stop: jest.fn()
    };

    jest.clearAllMocks();
  });

  it("should stop an existing job successfully", async () => {
    activeJobs.set("AAPL", mockJob as ScheduledTask);

    stopStockJob(req as Request, res as Response);

    expect(mockJob.stop).toHaveBeenCalled();
    expect(activeJobs.has("AAPL")).toBe(false);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Stopped scheduled job for AAPL"
    });
  });

  it("should convert symbol to uppercase", async () => {
    req.params = { symbol: "aapl" };
    activeJobs.set("AAPL", mockJob as ScheduledTask);

    stopStockJob(req as Request, res as Response);

    expect(mockJob.stop).toHaveBeenCalled();
    expect(activeJobs.has("AAPL")).toBe(false);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Stopped scheduled job for AAPL"
    });
  });

  it("should return 404 when job does not exist", async () => {
    stopStockJob(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No scheduled job found for AAPL"
    });
  });

  it("should handle multiple different symbols", async () => {
    // Set up multiple jobs
    const mockJob2 = { stop: jest.fn() } as Partial<ScheduledTask>;
    activeJobs.set("AAPL", mockJob as ScheduledTask);
    activeJobs.set("GOOGL", mockJob2 as ScheduledTask);

    // Stop only AAPL
    stopStockJob(req as Request, res as Response);

    expect(mockJob.stop).toHaveBeenCalled();
    expect(mockJob2.stop).not.toHaveBeenCalled();
    expect(activeJobs.has("AAPL")).toBe(false);
    expect(activeJobs.has("GOOGL")).toBe(true);
  });

  it("should handle stopping the same job twice", async () => {
    activeJobs.set("AAPL", mockJob as ScheduledTask);

    // Stop it once
    stopStockJob(req as Request, res as Response);
    
    expect(res.status).toHaveBeenCalledWith(200);
    jest.clearAllMocks();

    // Try to stop it again
    stopStockJob(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "No scheduled job found for AAPL"
    });
  });

  it("should handle invalid symbol validation", async () => {
    req.params = { symbol: "" };

    stopStockJob(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to stop scheduled job",
      details: "No symbol provided: ''"
    });
  });

  it("should handle whitespace-only symbol validation", async () => {
    req.params = { symbol: "   " };

    stopStockJob(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to stop scheduled job",
      details: "No symbol provided: '   '"
    });
  });
});
