/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["../../packages/config/eslint/react.js"],
  ignorePatterns: [".eslintrc.js", "storybook-static/**"],
}; 