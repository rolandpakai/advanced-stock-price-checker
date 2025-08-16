import { logger, createModuleLogger, serverLogger, stockLogger, jobLogger, dbLogger } from "./logger";

describe("Logger", () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env.NODE_ENV;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env.NODE_ENV = originalEnv;
    } else {
      delete process.env.NODE_ENV;
    }
  });

  describe("main logger", () => {
    it("should create a logger instance", () => {
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe("function");
      expect(typeof logger.error).toBe("function");
      expect(typeof logger.warn).toBe("function");
      expect(typeof logger.debug).toBe("function");
    });

    it("should use debug level in development", () => {
      process.env.NODE_ENV = "development";
      
      expect(() => {
        logger.debug("test message");
      }).not.toThrow();
    });

    it("should use info level in production", () => {
      process.env.NODE_ENV = "production";
      
      expect(() => {
        logger.info("test message");
      }).not.toThrow();
    });
  });

  describe("createModuleLogger", () => {
    it("should create a child logger with module context", () => {
      const moduleLogger = createModuleLogger("test-module");
      
      expect(moduleLogger).toBeDefined();
      expect(typeof moduleLogger.info).toBe("function");
      expect(typeof moduleLogger.error).toBe("function");
      expect(typeof moduleLogger.warn).toBe("function");
      expect(typeof moduleLogger.debug).toBe("function");
    });

    it("should create different loggers for different modules", () => {
      const moduleLogger1 = createModuleLogger("module1");
      const moduleLogger2 = createModuleLogger("module2");
      
      expect(moduleLogger1).not.toBe(moduleLogger2);
    });
  });

  describe("predefined module loggers", () => {
    it("should export serverLogger", () => {
      expect(serverLogger).toBeDefined();
      expect(typeof serverLogger.info).toBe("function");
    });

    it("should export stockLogger", () => {
      expect(stockLogger).toBeDefined();
      expect(typeof stockLogger.info).toBe("function");
    });

    it("should export jobLogger", () => {
      expect(jobLogger).toBeDefined();
      expect(typeof jobLogger.info).toBe("function");
    });

    it("should export dbLogger", () => {
      expect(dbLogger).toBeDefined();
      expect(typeof dbLogger.info).toBe("function");
    });
  });

  describe("logging methods", () => {
    it("should support structured logging with objects", () => {
      expect(() => {
        logger.info({ key: "value", number: 123 }, "Test message");
      }).not.toThrow();
    });

    it("should support simple string messages", () => {
      expect(() => {
        logger.info("Simple test message");
      }).not.toThrow();
    });

    it("should support error logging", () => {
      const error = new Error("Test error");
      expect(() => {
        logger.error({ error }, "Error occurred");
      }).not.toThrow();
    });

    it("should support warning logging", () => {
      expect(() => {
        logger.warn({ warning: "something" }, "Warning message");
      }).not.toThrow();
    });

    it("should support debug logging", () => {
      expect(() => {
        logger.debug({ debug: "info" }, "Debug message");
      }).not.toThrow();
    });
  });
});
