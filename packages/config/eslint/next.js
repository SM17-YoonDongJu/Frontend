// web(App Router)용 ESLint 레이어: 공유 베이스 + Next 공식 flat config.
// eslint-config-next 16 은 네이티브 flat config 배열을 export 하므로 직접 합친다.
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import base from "./base.js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...base,
  ...nextCoreWebVitals,
  // next/typescript 가 @typescript-eslint 플러그인을 등록한다.
  ...nextTypescript,
  {
    // 플러그인 등록 이후라 안전하게 TS 규칙을 덮어쓴다.
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
      ]
    }
  }
];
