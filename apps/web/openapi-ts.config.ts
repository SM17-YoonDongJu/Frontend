import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  // 커밋된 스냅샷을 입력으로 쓴다 — 원격 dev 서버 상태에 따라 생성물이 흔들리지 않게.
  // 스냅샷 갱신은 `pnpm spec:pull`, 원격과의 드리프트 감지는 api-spec-drift 워크플로가 담당.
  input: process.env.OPENAPI_SPEC_SOURCE ?? "./openapi/api-docs.json",
  output: "./src/shared/api/generated",
  plugins: [
    "@hey-api/client-fetch",
    "@hey-api/typescript",
    {
      name: "zod",
      exportFromIndex: true,
      definitions: {
        case: "PascalCase",
        name: "{{name}}Schema",
      },
    },
    "@hey-api/sdk",
    // @tanstack/react-query 플러그인은 끈다 — 생성 queryFn이 응답을 그대로 반환해
    // 수동 zod 검증·변환이 빠지고, staleTime·캐시 갱신은 어차피 우리 훅이 갖는다.
    // 응답 검증을 sdk validator로 옮긴 뒤 채택 여부를 다시 판단한다.
  ],
});
