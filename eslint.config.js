import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["**/dist/**", "**/node_modules/**", "coverage/**"] },
  { ...js.configs.recommended, files: ["**/*.js"] },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx}"],
    languageOptions: { ...config.languageOptions, globals: { ...globals.node, ...globals.browser } },
  })),
];
