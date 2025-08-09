import { Request, Response } from "express";
import { ScheduledTask } from "node-cron";
import { startStockJob, setActiveJobs } from "./startStockJob";
import { startStockQuoteFetcherJob } from "../../jobs/stockQuoteFetcher";

jest.mock("../../jobs/stockQuoteFetcher");

const mockStartStockQuoteFetcherJob = startStockQuoteFetcherJob as jest.MockedFunction<typeof startStockQuoteFetcherJob>;

describe("startStockJob Controller", () => {
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

  it("should start a new job successfully", async () => {
    mockStartStockQuoteFetcherJob.mockReturnValue(mockJob as ScheduledTask);

    startStockJob(req as Request, res as Response);

    expect(mockStartStockQuoteFetcherJob).toHaveBeenCalledWith("AAPL", "0 * * * * *");
    expect(activeJobs.has("AAPL")).toBe(true);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Started scheduled job for AAPL"
    });
  });

  it("should convert symbol to uppercase", async () => {
    req.params = { symbol: "aapl" };
    mockStartStockQuoteFetcherJob.mockReturnValue(mockJob as ScheduledTask);

    startStockJob(req as Request, res as Response);

    expect(mockStartStockQuoteFetcherJob).toHaveBeenCalledWith("AAPL", "0 * * * * *");
    expect(activeJobs.has("AAPL")).toBe(true);
  });

  it("should return 409 when job already exists", async () => {
    activeJobs.set("AAPL", mockJob as ScheduledTask);

    startStockJob(req as Request, res as Response);

    expect(mockStartStockQuoteFetcherJob).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Scheduled job already running for AAPL"
    });
  });

  it("should handle job creation errors", async () => {
    const error = new Error("Failed to create job");
    mockStartStockQuoteFetcherJob.mockImplementation(() => {
      throw error;
    });

    startStockJob(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to start scheduled job",
      details: "Failed to create job"
    });
    expect(activeJobs.has("AAPL")).toBe(false);
  });

  it("should handle invalid symbol validation", async () => {
    req.params = { symbol: "" };

    startStockJob(req as Request, res as Response);

    expect(mockStartStockQuoteFetcherJob).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to start scheduled job",
      details: "No symbol provided: ''"
    });
    expect(activeJobs.has("AAPL")).toBe(false);
  });

  it("should handle whitespace-only symbol validation", async () => {
    req.params = { symbol: "   " };

    startStockJob(req as Request, res as Response);

    expect(mockStartStockQuoteFetcherJob).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Failed to start scheduled job",
      details: "No symbol provided: '   '"
    });
  });

  it("should handle starting the same job twice", async () => {
    activeJobs.set("AAPL", mockJob as ScheduledTask);
  
    // Start it once
    startStockJob(req as Request, res as Response);
    
    req.params = { symbol: "aapl" };

    // Try to start it again
    startStockJob(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      message: "Scheduled job already running for AAPL"
    });
  });
});
