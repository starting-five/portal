import js from "@eslint/js";
import node from "eslint-plugin-node";
import importPlugin from "eslint-plugin-import";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "script",
      // globals: {},
      parser: typescriptParser,
    },
    plugins: {
      node,
      import: importPlugin,
      "@typescript-eslint": typescriptPlugin,
    },
    rules: {
      "no-html-link-for-pages": "off",
      "import/no-commonjs": "off",
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },
];
