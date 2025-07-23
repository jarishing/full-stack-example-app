/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["./base.js"],
  env: {
    jest: true,
    node: true,
  },
  rules: {
    // Relax TypeScript rules for test files
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-non-null-assertion": "off",

    // Allow console methods in tests
    "no-console": "off",

    // Allow process.env modifications in tests
    "no-global-assign": "off",

    // Jest specific rules would go here if we had eslint-plugin-jest
    // "jest/no-disabled-tests": "warn",
    // "jest/no-focused-tests": "error",
    // "jest/no-identical-title": "error",
    // "jest/prefer-to-have-length": "warn",
    // "jest/valid-expect": "error",
  },
  globals: {
    // Additional Jest globals if needed
    jest: true,
    describe: true,
    it: true,
    test: true,
    expect: true,
    beforeAll: true,
    beforeEach: true,
    afterAll: true,
    afterEach: true,
  },
};
