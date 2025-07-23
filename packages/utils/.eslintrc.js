/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["../config/eslint/base.js"],
  ignorePatterns: [".eslintrc.js"],
  overrides: [
    // Jest test files configuration
    {
      files: [
        "**/*.test.{js,ts}",
        "**/*.spec.{js,ts}",
        "**/tests/**/*.{js,ts}",
        "**/__tests__/**/*.{js,ts}",
        "**/setup.{js,ts}"
      ],
      env: {
        jest: true,
        node: true,
      },
      rules: {
        // Relax some rules for test files
        "@typescript-eslint/no-explicit-any": "off",
        "no-console": "off",
        // Allow process.env modifications in tests
        "@typescript-eslint/no-var-requires": "off",
      },
    },
  ],
}; 