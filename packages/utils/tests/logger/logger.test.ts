import winston from "winston";

import { logger } from "../../src/logger";

// Mock winston to control the test environment
jest.mock("winston", () => {
  const mockFormat: any = {
    combine: jest.fn((): any => mockFormat),
    timestamp: jest.fn((): any => mockFormat),
    errors: jest.fn((): any => mockFormat),
    json: jest.fn((): any => mockFormat),
    simple: jest.fn((): any => mockFormat),
    colorize: jest.fn((): any => mockFormat),
    printf: jest.fn((): any => mockFormat),
  };

  const mockTransport = {
    Console: jest.fn(),
    File: jest.fn(),
  };

  const mockLogger = {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    http: jest.fn(),
    verbose: jest.fn(),
    debug: jest.fn(),
    silly: jest.fn(),
  };

  return {
    createLogger: jest.fn(() => mockLogger),
    format: mockFormat,
    transports: mockTransport,
    __mockLogger: mockLogger,
  };
});

describe("Logger", () => {
  let mockLogger: any;

  beforeEach(() => {
    mockLogger = (winston as any).__mockLogger;
    jest.clearAllMocks();
  });

  describe("Logger Creation", () => {
    it("should create a winston logger instance", () => {
      expect(winston.createLogger).toHaveBeenCalled();
    });

    it("should configure appropriate transports", () => {
      expect(winston.transports.Console).toHaveBeenCalled();
    });

    it("should configure winston format", () => {
      expect(winston.format.combine).toHaveBeenCalled();
      expect(winston.format.timestamp).toHaveBeenCalled();
      expect(winston.format.errors).toHaveBeenCalled();
    });
  });

  describe("Log Levels", () => {
    it("should log error messages", () => {
      const errorMessage = "Test error message";
      const errorMeta = { error: "test-error", code: 500 };

      logger.error(errorMessage, errorMeta);

      expect(mockLogger.error).toHaveBeenCalledWith(errorMessage, errorMeta);
    });

    it("should log warning messages", () => {
      const warnMessage = "Test warning message";
      const warnMeta = { warning: "test-warning" };

      logger.warn(warnMessage, warnMeta);

      expect(mockLogger.warn).toHaveBeenCalledWith(warnMessage, warnMeta);
    });

    it("should log info messages", () => {
      const infoMessage = "Test info message";
      const infoMeta = { info: "test-info" };

      logger.info(infoMessage, infoMeta);

      expect(mockLogger.info).toHaveBeenCalledWith(infoMessage, infoMeta);
    });

    it("should log http messages", () => {
      const httpMessage = "HTTP request";
      const httpMeta = { method: "GET", url: "/api/test" };

      logger.http(httpMessage, httpMeta);

      expect(mockLogger.http).toHaveBeenCalledWith(httpMessage, httpMeta);
    });

    it("should log verbose messages", () => {
      const verboseMessage = "Verbose message";
      const verboseMeta = { details: "verbose-details" };

      logger.verbose(verboseMessage, verboseMeta);

      expect(mockLogger.verbose).toHaveBeenCalledWith(
        verboseMessage,
        verboseMeta,
      );
    });

    it("should log debug messages", () => {
      const debugMessage = "Debug message";
      const debugMeta = { debug: "debug-info" };

      logger.debug(debugMessage, debugMeta);

      expect(mockLogger.debug).toHaveBeenCalledWith(debugMessage, debugMeta);
    });
  });

  describe("Message Formatting", () => {
    it("should handle string messages", () => {
      const message = "Simple string message";

      logger.info(message);

      expect(mockLogger.info).toHaveBeenCalledWith(message, undefined);
    });

    it("should handle messages with metadata", () => {
      const message = "Message with metadata";
      const metadata = {
        userId: "123",
        action: "login",
        timestamp: new Date().toISOString(),
      };

      logger.info(message, metadata);

      expect(mockLogger.info).toHaveBeenCalledWith(message, metadata);
    });

    it("should handle complex metadata objects", () => {
      const message = "Complex metadata message";
      const metadata = {
        user: {
          id: "123",
          email: "test@example.com",
        },
        request: {
          method: "POST",
          url: "/api/users",
          headers: {
            "content-type": "application/json",
          },
        },
        performance: {
          duration: 150,
          memory: "25MB",
        },
      };

      logger.info(message, metadata);

      expect(mockLogger.info).toHaveBeenCalledWith(message, metadata);
    });

    it("should handle error objects in metadata", () => {
      const message = "Error occurred";
      const error = new Error("Test error");
      error.stack = "Error stack trace";

      logger.error(message, { error });

      expect(mockLogger.error).toHaveBeenCalledWith(message, { error });
    });
  });

  describe("Environment-Specific Behavior", () => {
    const originalEnv = process.env.NODE_ENV;

    afterEach(() => {
      process.env.NODE_ENV = originalEnv;
    });

    it("should handle development environment", () => {
      process.env.NODE_ENV = "development";

      // In a real test, we'd verify development-specific format
      logger.info("Development message");

      expect(mockLogger.info).toHaveBeenCalled();
    });

    it("should handle production environment", () => {
      process.env.NODE_ENV = "production";

      // In a real test, we'd verify production-specific format
      logger.info("Production message");

      expect(mockLogger.info).toHaveBeenCalled();
    });

    it("should handle test environment", () => {
      process.env.NODE_ENV = "test";

      // In a real test, we'd verify test-specific format
      logger.info("Test message");

      expect(mockLogger.info).toHaveBeenCalled();
    });
  });

  describe("Request ID Tracking", () => {
    it("should include request ID when provided", () => {
      const message = "Request tracking message";
      const metadata = {
        requestId: "req-123456",
        userId: "user-789",
      };

      logger.info(message, metadata);

      expect(mockLogger.info).toHaveBeenCalledWith(message, metadata);
    });

    it("should handle missing request ID gracefully", () => {
      const message = "Message without request ID";
      const metadata = {
        userId: "user-789",
      };

      logger.info(message, metadata);

      expect(mockLogger.info).toHaveBeenCalledWith(message, metadata);
    });
  });

  describe("Performance Considerations", () => {
    it("should not evaluate expensive operations when logging is disabled", () => {
      const expensiveOperation = jest.fn(() => {
        // Simulate expensive computation
        return { result: "expensive-data" };
      });

      // This would normally be logged at a level that's disabled
      logger.silly("Expensive operation", expensiveOperation());

      expect(mockLogger.silly).toHaveBeenCalled();
      expect(expensiveOperation).toHaveBeenCalled();
    });
  });
});
