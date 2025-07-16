import config from "config";

// Type definitions for configuration
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface AppConfig {
  app: {
    name: string;
    version: string;
    port: number;
    env: string;
    logLevel?: string;
  };
  database: {
    host: string;
    port: number;
    name: string;
    ssl: boolean;
    pool: {
      min: number;
      max: number;
    };
  };
  auth: {
    jwt: {
      secret: string;
      expiresIn: string;
    };
    bcrypt: {
      rounds: number;
    };
    session: {
      secret: string;
      maxAge: number;
    };
  };
  security: {
    cors: {
      origin: string | string[];
      credentials: boolean;
    };
    rateLimit: {
      windowMs: number;
      max: number;
    };
    helmet: Record<string, any>;
  };
}

// Configuration with type safety
export const appConfig: AppConfig = {
  app: {
    name: config.get<string>("app.name"),
    version: config.get<string>("app.version"),
    port: config.get<number>("app.port"),
    env: config.get<string>("app.env"),
    logLevel: config.get<string>("app.logLevel"),
  },
  database: {
    host: config.get<string>("database.host"),
    port: config.get<number>("database.port"),
    name: config.get<string>("database.name"),
    ssl: config.get<boolean>("database.ssl"),
    pool: {
      min: config.get<number>("database.pool.min"),
      max: config.get<number>("database.pool.max"),
    },
  },
  auth: {
    jwt: {
      secret: config.get<string>("auth.jwt.secret"),
      expiresIn: config.get<string>("auth.jwt.expiresIn"),
    },
    bcrypt: {
      rounds: config.get<number>("auth.bcrypt.rounds"),
    },
    session: {
      secret: config.get<string>("auth.session.secret"),
      maxAge: config.get<number>("auth.session.maxAge"),
    },
  },
  security: {
    cors: {
      origin: config.get<string>("security.cors.origin"),
      credentials: config.get<boolean>("security.cors.credentials"),
    },
    rateLimit: {
      windowMs: config.get<number>("security.rateLimit.windowMs"),
      max: config.get<number>("security.rateLimit.max"),
    },
    helmet: config.get<Record<string, any>>("security.helmet"),
  },
};

// Environment helper functions
export const isDevelopment = () =>
  process.env.NODE_ENV === "development" || process.env.NODE_ENV === "dev";
export const isProduction = () =>
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "prod";
export const isTest = () => process.env.NODE_ENV === "test";

// Configuration validation
export const validateConfig = () => {
  const required = [
    "app.name",
    "app.port",
    "database.host",
    "database.port",
    "auth.jwt.secret",
  ];

  for (const key of required) {
    if (!config.has(key)) {
      throw new Error(`Missing required configuration: ${key}`);
    }
  }
};

// Initialize and validate configuration (skip in test environment)
if (process.env.NODE_ENV !== "test") {
  validateConfig();
}
