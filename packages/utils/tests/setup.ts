/**
 * Jest setup file for @conduit/utils package
 * Provides common test configurations and global mocks
 */

// Suppress console logs during tests unless explicitly needed
beforeEach(() => {
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

// Global test environment setup
process.env.NODE_ENV = "test";
