import {
  HttpStatusCode,
  ErrorSeverity,
  ErrorCategory,
  type ErrorContext,
  type ErrorProperties,
  type ErrorMetadata,
} from "../../src/error/types";

describe("Error Types and Enums", () => {
  describe("HttpStatusCode", () => {
    it("should have correct HTTP status code values", () => {
      expect(HttpStatusCode.BAD_REQUEST).toBe(400);
      expect(HttpStatusCode.UNAUTHORIZED).toBe(401);
      expect(HttpStatusCode.FORBIDDEN).toBe(403);
      expect(HttpStatusCode.NOT_FOUND).toBe(404);
      expect(HttpStatusCode.METHOD_NOT_ALLOWED).toBe(405);
      expect(HttpStatusCode.REQUEST_TIMEOUT).toBe(408);
      expect(HttpStatusCode.CONFLICT).toBe(409);
      expect(HttpStatusCode.UNPROCESSABLE_ENTITY).toBe(422);
      expect(HttpStatusCode.TOO_MANY_REQUESTS).toBe(429);
      expect(HttpStatusCode.INTERNAL_SERVER_ERROR).toBe(500);
      expect(HttpStatusCode.NOT_IMPLEMENTED).toBe(501);
      expect(HttpStatusCode.SERVICE_UNAVAILABLE).toBe(503);
    });

    it("should be usable in switch statements", () => {
      const getErrorType = (code: HttpStatusCode) => {
        switch (code) {
          case HttpStatusCode.BAD_REQUEST:
            return "client_error";
          case HttpStatusCode.INTERNAL_SERVER_ERROR:
            return "server_error";
          default:
            return "unknown";
        }
      };

      expect(getErrorType(HttpStatusCode.BAD_REQUEST)).toBe("client_error");
      expect(getErrorType(HttpStatusCode.INTERNAL_SERVER_ERROR)).toBe(
        "server_error",
      );
    });
  });

  describe("ErrorSeverity", () => {
    it("should have correct severity levels", () => {
      expect(ErrorSeverity.LOW).toBe("low");
      expect(ErrorSeverity.MEDIUM).toBe("medium");
      expect(ErrorSeverity.HIGH).toBe("high");
      expect(ErrorSeverity.CRITICAL).toBe("critical");
    });

    it("should be orderable by severity", () => {
      const severities = [
        ErrorSeverity.CRITICAL,
        ErrorSeverity.LOW,
        ErrorSeverity.HIGH,
        ErrorSeverity.MEDIUM,
      ];

      const severityOrder = {
        [ErrorSeverity.LOW]: 1,
        [ErrorSeverity.MEDIUM]: 2,
        [ErrorSeverity.HIGH]: 3,
        [ErrorSeverity.CRITICAL]: 4,
      };

      const sorted = severities.sort(
        (a, b) => severityOrder[a] - severityOrder[b],
      );
      expect(sorted).toEqual([
        ErrorSeverity.LOW,
        ErrorSeverity.MEDIUM,
        ErrorSeverity.HIGH,
        ErrorSeverity.CRITICAL,
      ]);
    });
  });

  describe("ErrorCategory", () => {
    it("should have correct category values", () => {
      expect(ErrorCategory.VALIDATION).toBe("validation");
      expect(ErrorCategory.AUTHENTICATION).toBe("authentication");
      expect(ErrorCategory.AUTHORIZATION).toBe("authorization");
      expect(ErrorCategory.BUSINESS_LOGIC).toBe("business_logic");
      expect(ErrorCategory.EXTERNAL_SERVICE).toBe("external_service");
      expect(ErrorCategory.DATABASE).toBe("database");
      expect(ErrorCategory.NETWORK).toBe("network");
      expect(ErrorCategory.SYSTEM).toBe("system");
    });

    it("should be usable for error categorization", () => {
      const categorizeError = (error: string) => {
        if (error.includes("validation")) return ErrorCategory.VALIDATION;
        if (error.includes("unauthorized")) return ErrorCategory.AUTHENTICATION;
        return ErrorCategory.SYSTEM;
      };

      expect(categorizeError("validation failed")).toBe(
        ErrorCategory.VALIDATION,
      );
      expect(categorizeError("unauthorized access")).toBe(
        ErrorCategory.AUTHENTICATION,
      );
      expect(categorizeError("unknown error")).toBe(ErrorCategory.SYSTEM);
    });
  });

  describe("Type Interfaces", () => {
    it("should accept valid ErrorContext", () => {
      const context: ErrorContext = {
        requestId: "req-123",
        userId: "user-456",
        resource: "article",
        action: "create",
        timestamp: new Date(),
        customField: "custom value",
      };

      expect(context.requestId).toBe("req-123");
      expect(context.userId).toBe("user-456");
      expect(context.resource).toBe("article");
      expect(context.action).toBe("create");
      expect(context.timestamp).toBeInstanceOf(Date);
      expect(context.customField).toBe("custom value");
    });

    it("should accept valid ErrorProperties", () => {
      const properties: ErrorProperties = {
        code: "VALIDATION_ERROR",
        context: {
          requestId: "req-123",
          resource: "user",
        },
        originalError: new Error("Original error"),
        details: {
          field: "email",
          value: "invalid-email",
        },
      };

      expect(properties.code).toBe("VALIDATION_ERROR");
      expect(properties.context?.requestId).toBe("req-123");
      expect(properties.originalError).toBeInstanceOf(Error);
      expect(properties.details?.field).toBe("email");
    });

    it("should accept valid ErrorMetadata", () => {
      const metadata: ErrorMetadata = {
        severity: ErrorSeverity.HIGH,
        category: ErrorCategory.VALIDATION,
        retryable: false,
        userMessage: "Please check your input",
        technicalMessage: "Field validation failed",
      };

      expect(metadata.severity).toBe(ErrorSeverity.HIGH);
      expect(metadata.category).toBe(ErrorCategory.VALIDATION);
      expect(metadata.retryable).toBe(false);
      expect(metadata.userMessage).toBe("Please check your input");
      expect(metadata.technicalMessage).toBe("Field validation failed");
    });

    it("should handle optional properties", () => {
      const minimalContext: ErrorContext = {};
      const minimalProperties: ErrorProperties = {};
      const minimalMetadata: ErrorMetadata = {
        severity: ErrorSeverity.LOW,
        category: ErrorCategory.SYSTEM,
        retryable: true,
      };

      expect(minimalContext).toBeDefined();
      expect(minimalProperties).toBeDefined();
      expect(minimalMetadata.severity).toBe(ErrorSeverity.LOW);
      expect(minimalMetadata.userMessage).toBeUndefined();
    });
  });
});
