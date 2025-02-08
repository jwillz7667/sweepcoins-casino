import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [
      "next/core-web-vitals",
      "plugin:security/recommended",
      "plugin:@typescript-eslint/recommended"
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "security": "eslint-plugin-security",
      "sonarjs": "eslint-plugin-sonarjs"
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-fs-filename": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "sonarjs/cognitive-complexity": ["error", 15]
    },
  }
);
