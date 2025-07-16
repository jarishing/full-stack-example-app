// Export error classes from the utils package
export class AppError extends Error {
  constructor(
    message: string,
    public properties?: Record<string, any>,
  ) {
    super(message);
    this.name = "AppError";

    // Attach additional properties to the error
    if (properties) {
      Object.assign(this, properties);
    }

    // Ensure stack trace is captured
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  // Custom JSON serialization
  toJSON() {
    const obj: Record<string, any> = {
      name: this.name,
      message: this.message,
    };

    // Add properties safely with circular reference detection
    if (this.properties) {
      try {
        // Use JSON.stringify with a replacer to detect circular references
        JSON.stringify(this.properties);
        Object.assign(obj, this.properties);
      } catch (error) {
        // Handle circular references gracefully
        obj.properties = "[Circular]";
      }
    }

    return obj;
  }
}

export class ApiError extends AppError {
  public statusCode: number;

  constructor(
    message: string,
    statusCode: number = 500,
    properties?: Record<string, any>,
  ) {
    super(message, properties);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

// HTTP Status Error Classes
export class ApiErrorBadRequest extends ApiError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, 400, properties);
    this.name = "ApiErrorBadRequest";
  }
}

export class ApiErrorUnauthorized extends ApiError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, 401, properties);
    this.name = "ApiErrorUnauthorized";
  }
}

export class ApiErrorForbidden extends ApiError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, 403, properties);
    this.name = "ApiErrorForbidden";
  }
}

export class ApiErrorNotFound extends ApiError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, 404, properties);
    this.name = "ApiErrorNotFound";
  }
}

export class ApiErrorMethodNotAllowed extends ApiError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, 405, properties);
    this.name = "ApiErrorMethodNotAllowed";
  }
}

export class ApiErrorRequestTimeout extends ApiError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, 408, properties);
    this.name = "ApiErrorRequestTimeout";
  }
}

export class ApiErrorConflict extends ApiError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, 409, properties);
    this.name = "ApiErrorConflict";
  }
}

export class ApiErrorUnprocessableEntity extends ApiError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, 422, properties);
    this.name = "ApiErrorUnprocessableEntity";
  }
}

export class ApiErrorTooManyRequests extends ApiError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, 429, properties);
    this.name = "ApiErrorTooManyRequests";
  }
}

export class ApiErrorInternalServerError extends ApiError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, 500, properties);
    this.name = "ApiErrorInternalServerError";
  }
}

export class ApiErrorNotImplemented extends ApiError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, 501, properties);
    this.name = "ApiErrorNotImplemented";
  }
}

export class ApiErrorServiceUnavailable extends ApiError {
  constructor(message: string, properties?: Record<string, any>) {
    super(message, 503, properties);
    this.name = "ApiErrorServiceUnavailable";
  }
}
