/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      eqeqeq: ["error", "smart"]
    }
  },
  {
    ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**"]
  }
];
