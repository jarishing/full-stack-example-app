// Validation exports
export * from "./validation";

// Logger exports
export * from "./logger";

// Configuration exports
export * from "./config";

// Utility functions from original codebase
export const getObjectId = () => {
  return crypto.randomUUID();
};

// Error handling utilities
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    if ((Error as any).captureStackTrace) {
      (Error as any).captureStackTrace(this, this.constructor);
    }
  }
}

// API Error classes for consistent error handling
export class ApiError extends AppError {
  constructor(message: string, statusCode: number = 500) {
    super(message, statusCode);
  }
}

export class ApiErrorBadRequest extends ApiError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

export class ApiErrorUnauthorized extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class ApiErrorForbidden extends ApiError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class ApiErrorNotFound extends ApiError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}

export class ApiErrorConflict extends ApiError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

export class ApiErrorUnprocessableEntity extends ApiError {
  constructor(message: string = "Unprocessable Entity") {
    super(message, 422);
  }
}

export class ApiErrorInternalServerError extends ApiError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}
