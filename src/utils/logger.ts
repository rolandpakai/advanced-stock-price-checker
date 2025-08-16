import pino from "pino";

const createLogger = () => {
  const isDevelopment = process.env.NODE_ENV === "development";
  
  if (isDevelopment) {
    // Development: pretty printed logs
    return pino({
      level: "debug",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    });
  } else {
    // Production: structured JSON logs
    return pino({
      level: "info",
      formatters: {
        level: (label) => {
          return { level: label };
        },
      },
      timestamp: pino.stdTimeFunctions.isoTime,
    });
  }
};

export const logger = createLogger();

export const createModuleLogger = (module: string) => {
  return logger.child({ module });
};

export const serverLogger = createModuleLogger("server");
export const stockLogger = createModuleLogger("stock");
export const jobLogger = createModuleLogger("job");
export const dbLogger = createModuleLogger("database");
