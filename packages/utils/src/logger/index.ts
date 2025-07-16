import winston from "winston";

// Custom log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Custom colors for log levels
const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(logColors);

// Format for development environment
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Format for production environment
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

// Create transports based on environment
const transports = [];

// Always log to console in development
if (process.env.NODE_ENV !== "production") {
  transports.push(
    new winston.transports.Console({
      format: developmentFormat,
    }),
  );
} else {
  transports.push(
    new winston.transports.Console({
      format: productionFormat,
    }),
  );
}

// Add file transport for production
if (process.env.NODE_ENV === "production") {
  transports.push(
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      format: productionFormat,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      format: productionFormat,
    }),
  );
}

// Create the logger instance
export const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  levels: logLevels,
  format: productionFormat,
  transports,
  exitOnError: false,
});

// Add request ID tracking for better debugging
export const addRequestId = (requestId: string) => {
  return logger.child({ requestId });
};

// Export types for TypeScript
export type Logger = typeof logger;
export type LogLevel = keyof typeof logLevels;
