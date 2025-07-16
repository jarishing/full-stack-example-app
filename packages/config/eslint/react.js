/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "./base.js",
    "next/core-web-vitals",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:jsx-a11y/recommended"
  ],
  plugins: ["react", "react-hooks", "jsx-a11y"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    es2022: true,
    node: true
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  rules: {
    // React specific rules
    "react/react-in-jsx-scope": "off", // Next.js doesn't require React import
    "react/prop-types": "off", // We use TypeScript for prop validation
    "react/jsx-props-no-spreading": "off",
    "react/jsx-no-target-blank": "error",
    "react/no-unescaped-entities": "off",
    "react/display-name": "off",

    // React Hooks rules
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // Accessibility rules
    "jsx-a11y/anchor-is-valid": "off", // Next.js Link component handles this
    "jsx-a11y/click-events-have-key-events": "warn",
    "jsx-a11y/no-static-element-interactions": "warn",

    // Next.js specific
    "@next/next/no-html-link-for-pages": "off"
  }
}; 