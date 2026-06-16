// eslint.config.js
import tseslint from "typescript-eslint";
import prettier from "eslint-config-prettier";

export default [
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
];
