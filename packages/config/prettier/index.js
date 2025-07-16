/** @type {import("prettier").Config} */
module.exports = {
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "es5",
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: "always",
  endOfLine: "lf",
  experimentalTernaries: false,
  
  // Plugin configurations
  plugins: ["prettier-plugin-packagejson", "prettier-plugin-organize-imports"],
  
  overrides: [
    {
      files: "*.json",
      options: {
        printWidth: 120
      }
    },
    {
      files: "*.md",
      options: {
        printWidth: 80,
        proseWrap: "always"
      }
    }
  ]
}; 