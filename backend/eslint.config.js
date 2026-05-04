export default [
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        performance: "readonly"
      }
    },
    rules: {
      // Errors – real bugs
      "no-var": "error",
      "eqeqeq": "error",
      "no-undef": "error",
      "no-const-assign": "error",
      "no-func-assign": "error",
      "no-unreachable": "error",
      "no-eval": "error",
      "no-debugger": "error",
      "no-constant-condition": "error",

      // Warnings – best practices
      "no-console": "warn",
      "prefer-const": "warn",
      "no-unused-vars": "warn",
      "no-empty": "warn",
      "curly": "warn",
      "no-shadow": "warn",
      "camelcase": "warn",
      "semi": ["warn", "always"],
      "no-irregular-whitespace": "warn"
    }
  }
];
