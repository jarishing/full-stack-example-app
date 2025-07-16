/**
 * Error-related types and interfaces for better type safety
 */

// Standard HTTP status codes for API errors
export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  REQUEST_TIMEOUT = 408,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
  NOT_IMPLEMENTED = 501,
  SERVICE_UNAVAILABLE = 503,
}

// Error context for better debugging
export interface ErrorContext {
  requestId?: string;
  userId?: string;
  resource?: string;
  action?: string;
  timestamp?: Date;
  [key: string]: any;
}

// Structured error properties
export interface ErrorProperties {
  code?: string;
  context?: ErrorContext;
  originalError?: Error;
  details?: Record<string, any>;
}

// Error severity levels
export enum ErrorSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
  CRITICAL = "critical",
}

// Error categories for monitoring and alerting
export enum ErrorCategory {
  VALIDATION = "validation",
  AUTHENTICATION = "authentication",
  AUTHORIZATION = "authorization",
  BUSINESS_LOGIC = "business_logic",
  EXTERNAL_SERVICE = "external_service",
  DATABASE = "database",
  NETWORK = "network",
  SYSTEM = "system",
}

// Enhanced error metadata
export interface ErrorMetadata {
  severity: ErrorSeverity;
  category: ErrorCategory;
  retryable: boolean;
  userMessage?: string;
  technicalMessage?: string;
}
