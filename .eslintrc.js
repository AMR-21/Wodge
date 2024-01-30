// This configuration only applies to the package manager root.
/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ["apps/**", "core/**", "config/**"],
  extends: ["turbo"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
