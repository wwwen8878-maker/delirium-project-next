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
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // 允许未使用的变量（开发阶段保留备用）
      "@typescript-eslint/no-unused-vars": "warn",
      // 允许在文本中使用引号
      "react/no-unescaped-entities": "off",
      // 允许使用 any 类型（某些情况下需要）
      "@typescript-eslint/no-explicit-any": "warn",
      // 放宽 Hook 依赖检查
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
