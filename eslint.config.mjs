import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Strict TypeScript rules
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // Prevent console.log in production
      "no-console": ["warn", { allow: ["warn", "error"] }],

      // React rules
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",

      // Prefer const
      "prefer-const": "error",

      // No var
      "no-var": "error",
    },
  },
]);

export default eslintConfig;
