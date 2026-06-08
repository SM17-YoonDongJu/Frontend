// 공유 ESLint 베이스 (프레임워크 무관). 플러그인 의존 규칙은 넣지 않는다 —
// 각 앱 레이어(next.js / react-native.js)가 플러그인을 등록한 뒤 확장한다.
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
