// eslint.config.mjs
/**
 * @file eslint.config.mjs
 * @description Manifiesto de configuración de ESLint ("Flat Config") de élite.
 *              Esta es la Única Fuente de Verdad para el análisis estático. Ha sido
 *              reconstruido para integrar todos los plugins definidos en `package.json`,
 *              restaurando el sistema de calidad de código canónico del proyecto.
 * @author Raz Podestá
 * @version 8.0.0
 */
import { FlatCompat } from "@eslint/eslintrc";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import jsxA11y from "eslint-plugin-jsx-a11y";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import reactHooks from "eslint-plugin-react-hooks";
import sentryPlugin from "eslint-plugin-sentry";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import vitestPlugin from "eslint-plugin-vitest";
import globals from "globals";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "dist/**",
      "node_modules/**",
      "sentry.*.config.ts",
      "coverage/**",
    ],
  },

  ...compat.extends("next/core-web-vitals"),
  {
    plugins: { "jsx-a11y": jsxA11y },
    rules: jsxA11y.configs.recommended.rules,
  },

  {
    plugins: { "simple-import-sort": simpleImportSort },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react", "^next"],
            ["^@?\\w"],
            ["^@/"],
            ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
            ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
            ["^.+\\.?(css)$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },

  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
      "@typescript-eslint": typescriptPlugin,
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...typescriptPlugin.configs["eslint-recommended"].rules,
      ...typescriptPlugin.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },

  {
    files: ["**/*.{ts,tsx,js,jsx,mjs,cjs}"],
    plugins: { sentry: sentryPlugin },
    rules: {
      ...sentryPlugin.rules["sentry/recommended"],
      ...sentryPlugin.rules["sentry/nextjs"],
    },
  },

  {
    files: ["**/tests/**/*.{ts,tsx}"],
    plugins: { vitest: vitestPlugin },
    rules: vitestPlugin.configs.recommended.rules,
    languageOptions: {
      globals: {
        ...vitestPlugin.environments.env.globals,
      },
    },
  },

  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },

  eslintPluginPrettierRecommended,
];

export default eslintConfig;
