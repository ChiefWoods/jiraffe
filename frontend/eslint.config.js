import globals from "globals";
import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  js.configs.recommended,
  reactRecommended,
  reactJsxRuntime,
  prettierConfig,
  {
    files: ["src/**/*.js{,x}"],
    ignores: ["**/*.json", "dist"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      indent: [
        "warn",
        2,
        {
          SwitchCase: 1,
          FunctionDeclaration: {
            body: 1,
            parameters: 2,
          },
          FunctionExpression: {
            body: 1,
            parameters: 2,
          },
        },
      ],
      quotes: [
        "warn",
        "double",
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
      semi: ["warn", "always"],
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "_",
        },
      ],
      "comma-dangle": ["warn", "always-multiline"],
      "react/jsx-no-target-blank": ["off"],
      "react/prop-types": ["off"],
      "react-refresh/only-export-components": [
        "warn",
        {
          allowConstantExport: true,
        },
      ],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
];
