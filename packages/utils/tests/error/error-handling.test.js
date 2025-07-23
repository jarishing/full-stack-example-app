import {
  AppError,
  ApiError,
  ApiErrorBadRequest,
  ApiErrorUnauthorized,
  ApiErrorForbidden,
  ApiErrorNotFound,
  ApiErrorMethodNotAllowed,
  ApiErrorRequestTimeout,
  ApiErrorConflict,
  ApiErrorUnprocessableEntity,
  ApiErrorTooManyRequests,
  ApiErrorInternalServerError,
  ApiErrorNotImplemented,
  ApiErrorServiceUnavailable,
} from "../../src/error";
describe("Error Handling System", () => {
  describe("AppError", () => {
    it("should create a basic app error", () => {
      const message = "Something went wrong";
      const error = new AppError(message);
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(AppError);
      expect(error.message).toBe(message);
      expect(error.name).toBe("AppError");
      expect(error.stack).toBeDefined();
    });
    it("should handle error with custom properties", () => {
      const message = "Custom error";
      const code = "CUSTOM_ERROR";
      const error = new AppError(message, { code });
      expect(error.message).toBe(message);
      expect(error.code).toBe(code);
    });
    it("should preserve error stack trace", () => {
      const error = new AppError("Stack trace test");
      expect(error.stack).toContain("Stack trace test");
      expect(error.stack).toContain("error-handling.test.ts");
    });
  });
  describe("ApiError", () => {
    it("should create an API error with status code", () => {
      const message = "API error occurred";
      const statusCode = 400;
      const error = new ApiError(message, statusCode);
      expect(error).toBeInstanceOf(AppError);
      expect(error).toBeInstanceOf(ApiError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.name).toBe("ApiError");
    });
    it("should default to 500 status code", () => {
      const error = new ApiError("Default status");
      expect(error.statusCode).toBe(500);
    });
    it("should accept additional properties", () => {
      const message = "API error with details";
      const statusCode = 400;
      const details = { field: "email", reason: "invalid format" };
      const error = new ApiError(message, statusCode, details);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.field).toBe(details.field);
      expect(error.reason).toBe(details.reason);
    });
  });
  describe("HTTP Status Error Classes", () => {
    describe("ApiErrorBadRequest (400)", () => {
      it("should create a 400 Bad Request error", () => {
        const message = "Invalid request data";
        const error = new ApiErrorBadRequest(message);
        expect(error).toBeInstanceOf(ApiError);
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe(message);
        expect(error.name).toBe("ApiErrorBadRequest");
      });
      it("should accept validation errors", () => {
        const validationErrors = [
          { field: "email", message: "Invalid email format" },
          { field: "password", message: "Password too weak" },
        ];
        const error = new ApiErrorBadRequest("Validation failed", {
          validationErrors,
        });
        expect(error.statusCode).toBe(400);
        expect(error.validationErrors).toEqual(validationErrors);
      });
    });
    describe("ApiErrorUnauthorized (401)", () => {
      it("should create a 401 Unauthorized error", () => {
        const message = "Authentication required";
        const error = new ApiErrorUnauthorized(message);
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe(message);
        expect(error.name).toBe("ApiErrorUnauthorized");
      });
      it("should handle token-related errors", () => {
        const error = new ApiErrorUnauthorized("Invalid token", {
          tokenType: "JWT",
          expiredAt: new Date().toISOString(),
        });
        expect(error.statusCode).toBe(401);
        expect(error.tokenType).toBe("JWT");
        expect(error.expiredAt).toBeDefined();
      });
    });
    describe("ApiErrorForbidden (403)", () => {
      it("should create a 403 Forbidden error", () => {
        const message = "Access denied";
        const error = new ApiErrorForbidden(message);
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe(message);
        expect(error.name).toBe("ApiErrorForbidden");
      });
      it("should handle permission-related errors", () => {
        const error = new ApiErrorForbidden("Insufficient permissions", {
          requiredPermission: "admin",
          userPermissions: ["user"],
        });
        expect(error.statusCode).toBe(403);
        expect(error.requiredPermission).toBe("admin");
        expect(error.userPermissions).toEqual(["user"]);
      });
    });
    describe("ApiErrorNotFound (404)", () => {
      it("should create a 404 Not Found error", () => {
        const message = "Resource not found";
        const error = new ApiErrorNotFound(message);
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe(message);
        expect(error.name).toBe("ApiErrorNotFound");
      });
      it("should handle resource-specific errors", () => {
        const error = new ApiErrorNotFound("User not found", {
          resourceType: "User",
          resourceId: "123",
        });
        expect(error.statusCode).toBe(404);
        expect(error.resourceType).toBe("User");
        expect(error.resourceId).toBe("123");
      });
    });
    describe("ApiErrorMethodNotAllowed (405)", () => {
      it("should create a 405 Method Not Allowed error", () => {
        const message = "Method not allowed";
        const error = new ApiErrorMethodNotAllowed(message);
        expect(error.statusCode).toBe(405);
        expect(error.message).toBe(message);
        expect(error.name).toBe("ApiErrorMethodNotAllowed");
      });
      it("should handle allowed methods", () => {
        const error = new ApiErrorMethodNotAllowed("Method not allowed", {
          method: "DELETE",
          allowedMethods: ["GET", "POST", "PUT"],
        });
        expect(error.statusCode).toBe(405);
        expect(error.method).toBe("DELETE");
        expect(error.allowedMethods).toEqual(["GET", "POST", "PUT"]);
      });
    });
    describe("ApiErrorRequestTimeout (408)", () => {
      it("should create a 408 Request Timeout error", () => {
        const message = "Request timeout";
        const error = new ApiErrorRequestTimeout(message);
        expect(error.statusCode).toBe(408);
        expect(error.message).toBe(message);
        expect(error.name).toBe("ApiErrorRequestTimeout");
      });
      it("should handle timeout details", () => {
        const error = new ApiErrorRequestTimeout("Request timeout", {
          timeout: 30000,
          duration: 35000,
        });
        expect(error.statusCode).toBe(408);
        expect(error.timeout).toBe(30000);
        expect(error.duration).toBe(35000);
      });
    });
    describe("ApiErrorConflict (409)", () => {
      it("should create a 409 Conflict error", () => {
        const message = "Resource conflict";
        const error = new ApiErrorConflict(message);
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe(message);
        expect(error.name).toBe("ApiErrorConflict");
      });
      it("should handle conflict details", () => {
        const error = new ApiErrorConflict("Email already exists", {
          conflictType: "duplicate",
          field: "email",
          value: "test@example.com",
        });
        expect(error.statusCode).toBe(409);
        expect(error.conflictType).toBe("duplicate");
        expect(error.field).toBe("email");
        expect(error.value).toBe("test@example.com");
      });
    });
    describe("ApiErrorUnprocessableEntity (422)", () => {
      it("should create a 422 Unprocessable Entity error", () => {
        const message = "Unprocessable entity";
        const error = new ApiErrorUnprocessableEntity(message);
        expect(error.statusCode).toBe(422);
        expect(error.message).toBe(message);
        expect(error.name).toBe("ApiErrorUnprocessableEntity");
      });
      it("should handle semantic validation errors", () => {
        const error = new ApiErrorUnprocessableEntity(
          "Semantic validation failed",
          {
            semanticErrors: [
              {
                rule: "business_rule_1",
                message: "Cannot delete user with active orders",
              },
            ],
          },
        );
        expect(error.statusCode).toBe(422);
        expect(error.semanticErrors).toBeDefined();
      });
    });
    describe("ApiErrorTooManyRequests (429)", () => {
      it("should create a 429 Too Many Requests error", () => {
        const message = "Rate limit exceeded";
        const error = new ApiErrorTooManyRequests(message);
        expect(error.statusCode).toBe(429);
        expect(error.message).toBe(message);
        expect(error.name).toBe("ApiErrorTooManyRequests");
      });
      it("should handle rate limit details", () => {
        const error = new ApiErrorTooManyRequests("Rate limit exceeded", {
          limit: 100,
          windowMs: 3600000,
          retryAfter: 1800,
        });
        expect(error.statusCode).toBe(429);
        expect(error.limit).toBe(100);
        expect(error.windowMs).toBe(3600000);
        expect(error.retryAfter).toBe(1800);
      });
    });
    describe("ApiErrorInternalServerError (500)", () => {
      it("should create a 500 Internal Server Error", () => {
        const message = "Internal server error";
        const error = new ApiErrorInternalServerError(message);
        expect(error.statusCode).toBe(500);
        expect(error.message).toBe(message);
        expect(error.name).toBe("ApiErrorInternalServerError");
      });
      it("should handle error tracking details", () => {
        const error = new ApiErrorInternalServerError(
          "Database connection failed",
          {
            errorId: "error-123456",
            component: "database",
            timestamp: new Date().toISOString(),
          },
        );
        expect(error.statusCode).toBe(500);
        expect(error.errorId).toBe("error-123456");
        expect(error.component).toBe("database");
        expect(error.timestamp).toBeDefined();
      });
    });
    describe("ApiErrorNotImplemented (501)", () => {
      it("should create a 501 Not Implemented error", () => {
        const message = "Feature not implemented";
        const error = new ApiErrorNotImplemented(message);
        expect(error.statusCode).toBe(501);
        expect(error.message).toBe(message);
        expect(error.name).toBe("ApiErrorNotImplemented");
      });
      it("should handle feature details", () => {
        const error = new ApiErrorNotImplemented("Feature not available", {
          feature: "advanced_search",
          plannedRelease: "2024.Q2",
        });
        expect(error.statusCode).toBe(501);
        expect(error.feature).toBe("advanced_search");
        expect(error.plannedRelease).toBe("2024.Q2");
      });
    });
    describe("ApiErrorServiceUnavailable (503)", () => {
      it("should create a 503 Service Unavailable error", () => {
        const message = "Service unavailable";
        const error = new ApiErrorServiceUnavailable(message);
        expect(error.statusCode).toBe(503);
        expect(error.message).toBe(message);
        expect(error.name).toBe("ApiErrorServiceUnavailable");
      });
      it("should handle maintenance details", () => {
        const error = new ApiErrorServiceUnavailable(
          "Maintenance in progress",
          {
            maintenanceWindow: {
              start: "2024-01-01T02:00:00Z",
              end: "2024-01-01T04:00:00Z",
            },
            retryAfter: 7200,
          },
        );
        expect(error.statusCode).toBe(503);
        expect(error.maintenanceWindow).toBeDefined();
        expect(error.retryAfter).toBe(7200);
      });
    });
  });
  describe("Error Serialization", () => {
    it("should serialize errors to JSON properly", () => {
      const error = new ApiErrorBadRequest("Validation failed", {
        field: "email",
        code: "INVALID_EMAIL",
      });
      const serialized = JSON.stringify(error);
      const parsed = JSON.parse(serialized);
      expect(parsed.message).toBe("Validation failed");
      expect(parsed.field).toBe("email");
      expect(parsed.code).toBe("INVALID_EMAIL");
    });
    it("should handle circular references in error data", () => {
      const circularObj = { name: "test" };
      circularObj.self = circularObj;
      const error = new ApiError("Circular reference test", 400, {
        data: circularObj,
      });
      // This should not throw an error when stringified
      expect(() => {
        JSON.stringify(error);
      }).not.toThrow();
    });
  });
  describe("Error Inheritance Chain", () => {
    it("should maintain proper inheritance chain", () => {
      const error = new ApiErrorBadRequest("Test error");
      expect(error instanceof Error).toBe(true);
      expect(error instanceof AppError).toBe(true);
      expect(error instanceof ApiError).toBe(true);
      expect(error instanceof ApiErrorBadRequest).toBe(true);
    });
    it("should allow instanceof checks for error handling", () => {
      const errors = [
        new ApiErrorBadRequest("Bad request"),
        new ApiErrorUnauthorized("Unauthorized"),
        new ApiErrorNotFound("Not found"),
        new ApiErrorInternalServerError("Server error"),
      ];
      errors.forEach((error) => {
        expect(error instanceof ApiError).toBe(true);
        if (error.statusCode >= 400 && error.statusCode < 500) {
          expect(error.statusCode).toBeLessThan(500);
        } else {
          expect(error.statusCode).toBeGreaterThanOrEqual(500);
        }
      });
    });
  });
});
