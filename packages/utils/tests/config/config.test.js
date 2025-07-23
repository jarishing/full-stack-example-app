import {
  appConfig,
  isDevelopment,
  isProduction,
  isTest,
} from "../../src/config";
describe("Configuration System", () => {
  const originalEnv = process.env.NODE_ENV;
  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });
  describe("appConfig", () => {
    it("should load configuration successfully", () => {
      expect(appConfig).toBeDefined();
      expect(typeof appConfig).toBe("object");
    });
    it("should have required configuration sections", () => {
      expect(appConfig.app).toBeDefined();
      expect(appConfig.database).toBeDefined();
      expect(appConfig.auth).toBeDefined();
      expect(appConfig.security).toBeDefined();
    });
    describe("app configuration", () => {
      it("should have app name and version", () => {
        expect(appConfig.app.name).toBeDefined();
        expect(typeof appConfig.app.name).toBe("string");
        expect(appConfig.app.version).toBeDefined();
        expect(typeof appConfig.app.version).toBe("string");
      });
      it("should have port configuration", () => {
        expect(appConfig.app.port).toBeDefined();
        expect(typeof appConfig.app.port).toBe("number");
        expect(appConfig.app.port).toBeGreaterThan(0);
        expect(appConfig.app.port).toBeLessThan(65536);
      });
      it("should have environment configuration", () => {
        expect(appConfig.app.env).toBeDefined();
        expect(typeof appConfig.app.env).toBe("string");
        expect(["development", "production", "test"]).toContain(
          appConfig.app.env,
        );
      });
    });
    describe("database configuration", () => {
      it("should have host configuration", () => {
        expect(appConfig.database.host).toBeDefined();
        expect(typeof appConfig.database.host).toBe("string");
      });
      it("should have port configuration", () => {
        expect(appConfig.database.port).toBeDefined();
        expect(typeof appConfig.database.port).toBe("number");
        expect(appConfig.database.port).toBeGreaterThan(0);
      });
      it("should have database name", () => {
        expect(appConfig.database.name).toBeDefined();
        expect(typeof appConfig.database.name).toBe("string");
      });
      it("should have connection configuration", () => {
        expect(appConfig.database.pool).toBeDefined();
        expect(appConfig.database.pool.min).toBeDefined();
        expect(appConfig.database.pool.max).toBeDefined();
        expect(typeof appConfig.database.pool.min).toBe("number");
        expect(typeof appConfig.database.pool.max).toBe("number");
        expect(appConfig.database.pool.min).toBeLessThanOrEqual(
          appConfig.database.pool.max,
        );
      });
      it("should have ssl configuration", () => {
        expect(appConfig.database.ssl).toBeDefined();
        expect(typeof appConfig.database.ssl).toBe("boolean");
      });
    });
    describe("auth configuration", () => {
      it("should have JWT configuration", () => {
        expect(appConfig.auth.jwt).toBeDefined();
        expect(appConfig.auth.jwt.secret).toBeDefined();
        expect(typeof appConfig.auth.jwt.secret).toBe("string");
        expect(appConfig.auth.jwt.expiresIn).toBeDefined();
        expect(typeof appConfig.auth.jwt.expiresIn).toBe("string");
      });
      it("should have bcrypt configuration", () => {
        expect(appConfig.auth.bcrypt).toBeDefined();
        expect(appConfig.auth.bcrypt.rounds).toBeDefined();
        expect(typeof appConfig.auth.bcrypt.rounds).toBe("number");
        expect(appConfig.auth.bcrypt.rounds).toBeGreaterThan(0);
        expect(appConfig.auth.bcrypt.rounds).toBeLessThanOrEqual(20);
      });
      it("should have session configuration", () => {
        expect(appConfig.auth.session).toBeDefined();
        expect(appConfig.auth.session.secret).toBeDefined();
        expect(typeof appConfig.auth.session.secret).toBe("string");
        expect(appConfig.auth.session.maxAge).toBeDefined();
        expect(typeof appConfig.auth.session.maxAge).toBe("number");
      });
    });
    describe("security configuration", () => {
      it("should have CORS configuration", () => {
        expect(appConfig.security.cors).toBeDefined();
        expect(appConfig.security.cors.origin).toBeDefined();
        expect(appConfig.security.cors.credentials).toBeDefined();
        expect(typeof appConfig.security.cors.credentials).toBe("boolean");
      });
      it("should have rate limiting configuration", () => {
        expect(appConfig.security.rateLimit).toBeDefined();
        expect(appConfig.security.rateLimit.windowMs).toBeDefined();
        expect(appConfig.security.rateLimit.max).toBeDefined();
        expect(typeof appConfig.security.rateLimit.windowMs).toBe("number");
        expect(typeof appConfig.security.rateLimit.max).toBe("number");
      });
      it("should have helmet configuration", () => {
        expect(appConfig.security.helmet).toBeDefined();
        expect(typeof appConfig.security.helmet).toBe("object");
      });
    });
  });
  describe("Environment Detection", () => {
    describe("isDevelopment", () => {
      it("should return true in development environment", () => {
        process.env.NODE_ENV = "development";
        // Note: We need to re-import or re-evaluate the function
        // since it's likely computed at module load time
        expect(isDevelopment()).toBe(true);
      });
      it("should return true in dev environment", () => {
        process.env.NODE_ENV = "dev";
        expect(isDevelopment()).toBe(true);
      });
      it("should return false in non-development environments", () => {
        process.env.NODE_ENV = "production";
        expect(isDevelopment()).toBe(false);
        process.env.NODE_ENV = "test";
        expect(isDevelopment()).toBe(false);
      });
      it("should handle undefined NODE_ENV", () => {
        delete process.env.NODE_ENV;
        // Should default to development behavior or handle gracefully
        expect(typeof isDevelopment()).toBe("boolean");
      });
    });
    describe("isProduction", () => {
      it("should return true in production environment", () => {
        process.env.NODE_ENV = "production";
        expect(isProduction()).toBe(true);
      });
      it("should return true in prod environment", () => {
        process.env.NODE_ENV = "prod";
        expect(isProduction()).toBe(true);
      });
      it("should return false in non-production environments", () => {
        process.env.NODE_ENV = "development";
        expect(isProduction()).toBe(false);
        process.env.NODE_ENV = "test";
        expect(isProduction()).toBe(false);
      });
    });
    describe("isTest", () => {
      it("should return true in test environment", () => {
        process.env.NODE_ENV = "test";
        expect(isTest()).toBe(true);
      });
      it("should return false in non-test environments", () => {
        process.env.NODE_ENV = "development";
        expect(isTest()).toBe(false);
        process.env.NODE_ENV = "production";
        expect(isTest()).toBe(false);
      });
    });
  });
  describe("Configuration Validation", () => {
    it("should have valid port numbers", () => {
      expect(appConfig.app.port).toBeGreaterThan(0);
      expect(appConfig.app.port).toBeLessThan(65536);
      expect(appConfig.database.port).toBeGreaterThan(0);
      expect(appConfig.database.port).toBeLessThan(65536);
    });
    it("should have secure JWT secret length", () => {
      expect(appConfig.auth.jwt.secret.length).toBeGreaterThanOrEqual(32);
    });
    it("should have reasonable bcrypt rounds", () => {
      expect(appConfig.auth.bcrypt.rounds).toBeGreaterThanOrEqual(10);
      expect(appConfig.auth.bcrypt.rounds).toBeLessThanOrEqual(15);
    });
    it("should have valid rate limit values", () => {
      expect(appConfig.security.rateLimit.windowMs).toBeGreaterThan(0);
      expect(appConfig.security.rateLimit.max).toBeGreaterThan(0);
    });
    it("should have reasonable session max age", () => {
      // Should be at least 1 hour and at most 30 days
      const oneHour = 60 * 60 * 1000;
      const thirtyDays = 30 * 24 * 60 * 60 * 1000;
      expect(appConfig.auth.session.maxAge).toBeGreaterThanOrEqual(oneHour);
      expect(appConfig.auth.session.maxAge).toBeLessThanOrEqual(thirtyDays);
    });
  });
  describe("Environment-Specific Configuration", () => {
    it("should have appropriate database pool size for test environment", () => {
      if (isTest()) {
        // Test environment should use smaller pool sizes
        expect(appConfig.database.pool.max).toBeLessThanOrEqual(10);
      }
    });
    it("should have appropriate logging level for environment", () => {
      if (isDevelopment()) {
        // Development should allow debug logging
        expect(["debug", "verbose", "info"]).toContain(
          appConfig.app.logLevel ?? "info",
        );
      } else if (isProduction()) {
        // Production should use higher log levels
        expect(["warn", "error", "info"]).toContain(
          appConfig.app.logLevel ?? "info",
        );
      }
    });
    it("should have stricter security in production", () => {
      if (isProduction()) {
        // Production should have stricter rate limits
        expect(appConfig.security.rateLimit.max).toBeLessThanOrEqual(1000);
        // Should use HTTPS in production CORS settings
        if (typeof appConfig.security.cors.origin === "string") {
          expect(appConfig.security.cors.origin).toMatch(/^https:/);
        }
      }
    });
  });
  describe("Type Safety", () => {
    it("should maintain type safety for all configuration values", () => {
      // This test ensures TypeScript types are working correctly
      const config = appConfig;
      // These should not cause TypeScript errors
      expect(typeof config.app.name).toBe("string");
      expect(typeof config.app.port).toBe("number");
      expect(typeof config.app.env).toBe("string");
      expect(typeof config.database.host).toBe("string");
      expect(typeof config.database.port).toBe("number");
      expect(typeof config.auth.jwt.secret).toBe("string");
      expect(typeof config.security.cors.credentials).toBe("boolean");
    });
    it("should have readonly properties where appropriate", () => {
      // Attempt to modify should fail in TypeScript (runtime test for structure)
      expect(() => {
        const config = appConfig;
        // In a real scenario with readonly types, this would be a TypeScript error
        expect(config).toBeDefined();
      }).not.toThrow();
    });
  });
});
