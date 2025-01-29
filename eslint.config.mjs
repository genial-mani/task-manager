import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",  // Disable 'any' rule
      "@typescript-eslint/no-unused-vars": "warn",  // Change unused vars to a warning
      "react-hooks/exhaustive-deps": "warn",        // Warn instead of error for missing dependencies
    },
  },
];

export default eslintConfig;
