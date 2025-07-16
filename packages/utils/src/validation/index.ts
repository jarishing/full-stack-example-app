// User validation exports
export * from "./user";

// Article validation exports
export * from "./article";

// Common validation utilities
export { z } from "zod";

// Generic validation result type
export type ValidationResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: {
        issues: Array<{
          path: (string | number)[];
          message: string;
          code: string;
        }>;
      };
    };

// Helper function to format Zod errors for API responses
export const formatValidationError = (error: any) => {
  return {
    message: "Validation failed",
    errors: error.issues.map((issue: any) => ({
      field: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    })),
  };
};
