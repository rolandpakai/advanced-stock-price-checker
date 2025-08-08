import js from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest, // so Jest globals like "describe" and "it" are recognized
      },
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    files: ["src/**/*.{ts,tsx}", "tests/**/*.{ts,tsx}"],
    rules: {
      // General best practices
      "no-unused-vars": "off", // handled by TS
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
      "prefer-const": "error",

      // TypeScript-specific
      "@typescript-eslint/explicit-function-return-type": "off", // optional, can enforce if you want
      "@typescript-eslint/no-explicit-any": "warn",

      // Code style
      "quotes": ["error", "double"],
      "semi": ["error", "always"],
    },
  }
);
