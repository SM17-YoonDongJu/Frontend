import { defineConfig } from "@hey-api/openapi-ts";

const SNAKE_SEGMENT = /_([a-z0-9])/g;
const toCamel = (key: string): string =>
  key.replace(SNAKE_SEGMENT, (_, ch: string) => ch.toUpperCase());

/**
 * 백엔드 전역 Jackson snake_case 전략이 springdoc의 문서 직렬화에까지 새어나가,
 * OpenAPI 예약어(operationId·maxLength·requestBody)까지 snake로 나온다.
 * 그대로 두면 생성기가 예약어를 못 읽어 SDK 함수명이 경로 기반으로 폴백하고
 * 길이·개수 제약이 통째로 사라진다.
 *
 * 예약어만 camel로 되돌리고 DTO 필드명은 snake 그대로 둔다 — 와이어가 snake이므로
 * 스펙이 말하는 필드명이 사실이고, 생성물이 그 사실을 그대로 반영해야 검증이 성립한다.
 * properties의 직계 키와 required 값이 필드명이라 그 둘만 건너뛴다.
 * 이미 camel이면 no-op이라 백엔드가 문서 직렬화를 고친 뒤에도 그대로 둘 수 있다.
 */
function normalizeSpecKeywords(node: unknown): void {
  if (Array.isArray(node)) {
    node.forEach(normalizeSpecKeywords);
    return;
  }
  if (node === null || typeof node !== "object") return;

  const obj = node as Record<string, unknown>;
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    // properties의 직계 키는 DTO 필드명 — 이름은 두고 값(스키마)만 훑는다.
    if (key === "properties" && value !== null && typeof value === "object") {
      Object.values(value as Record<string, unknown>).forEach(normalizeSpecKeywords);
      continue;
    }
    normalizeSpecKeywords(value);
    const camel = toCamel(key);
    if (camel !== key) {
      obj[camel] = value;
      delete obj[key];
    }
  }
}

export default defineConfig({
  // 커밋된 스냅샷을 입력으로 쓴다 — 원격 dev 서버 상태에 따라 생성물이 흔들리지 않게.
  // 스냅샷 갱신은 `pnpm spec:pull`, 원격과의 드리프트 감지는 api-spec-drift 워크플로가 담당.
  input: process.env.OPENAPI_SPEC_SOURCE ?? "./openapi/api-docs.json",
  output: "./src/shared/api/generated",
  parser: {
    patch: { input: normalizeSpecKeywords },
    // 규격 위반 스펙이 조용히 통과해 생성물만 망가지는 일을 막는다.
    validate_EXPERIMENTAL: "warn",
  },
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
