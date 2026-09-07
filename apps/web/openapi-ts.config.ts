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

/**
 * springdoc이 서로 다른 DTO의 중첩 아이템을 전부 `Item` 한 컴포넌트로 합쳐 내보낸다.
 * 살아남은 정의는 알림 아이템 모양뿐이라, 나머지 참조처(제안·보험·검수대기·사정사 등)는
 * 실제와 다른 스키마로 검증돼 정상 200 응답이 통째로 파싱 실패한다.
 *
 * 사라진 필드 정의는 스펙에 남아 있지 않아 복원할 수 없다. 그래서 지어내는 대신
 * 모양이 일치하는 소유자만 남기고 나머지 참조는 검증 대상에서 뺀다 — 거짓 검증만 걷어낸다.
 * 그 자리는 각 세그먼트의 손으로 쓴 zod 스키마가 이미 지키고 있다.
 *
 * 근본 해결은 백엔드가 inner class 이름 충돌을 없애 컴포넌트를 분리해 내보내는 것.
 * 스펙이 고쳐지면 충돌이 사라져 이 패치는 no-op이 된다.
 */
const COLLIDED_ITEM_REF = "#/components/schemas/Item";
const COLLIDED_ITEM_OWNER = "NotificationListResponse";

function toUnvalidatedObject(node: Record<string, unknown>): void {
  delete node.$ref;
  node.type = "object";
  node.additionalProperties = true;
}

/**
 * 백엔드가 "참조 타입인데 null 가능"을 { type: "null", $ref } 로 내보낸다.
 * OpenAPI 3.1에서 $ref 옆의 type은 무시되므로 생성기가 null 가능성을 잃고,
 * 실제로 null이 오는 응답(담당 사정사 미배정·첨부 없는 메시지 등)이 검증에서 거부된다.
 * 규격에 맞는 anyOf 형태로 바꿔 준다.
 */
function expandNullableRefs(node: unknown): void {
  if (Array.isArray(node)) {
    node.forEach(expandNullableRefs);
    return;
  }
  if (node === null || typeof node !== "object") return;

  const obj = node as Record<string, unknown>;
  if (typeof obj.$ref === "string" && obj.type === "null") {
    const ref = obj.$ref;
    delete obj.$ref;
    delete obj.type;
    obj.anyOf = [{ $ref: ref }, { type: "null" }];
  }
  Object.values(obj).forEach(expandNullableRefs);
}

function dropCollidedItemRefs(spec: unknown): void {
  const schemas = (spec as { components?: { schemas?: Record<string, unknown> } })?.components
    ?.schemas;
  if (!schemas) return;

  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node === null || typeof node !== "object") return;

    const obj = node as Record<string, unknown>;
    if (obj.$ref === COLLIDED_ITEM_REF) {
      toUnvalidatedObject(obj);
      return;
    }
    Object.values(obj).forEach(walk);
  };

  for (const [name, schema] of Object.entries(schemas)) {
    if (name === COLLIDED_ITEM_OWNER || name === "Item") continue;
    walk(schema);
  }
}

export default defineConfig({
  // 커밋된 스냅샷을 입력으로 쓴다 — 원격 dev 서버 상태에 따라 생성물이 흔들리지 않게.
  // 스냅샷 갱신은 `pnpm spec:pull`, 원격과의 드리프트 감지는 api-spec-drift 워크플로가 담당.
  input: process.env.OPENAPI_SPEC_SOURCE ?? "./openapi/api-docs.json",
  output: "./src/shared/api/generated",
  parser: {
    patch: {
      input: (spec: unknown) => {
        normalizeSpecKeywords(spec);
        dropCollidedItemRefs(spec);
        expandNullableRefs(spec);
      },
    },
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
    { name: "@hey-api/sdk", validator: { response: "zod" } },
    {
      name: "@tanstack/react-query",
      queryKeys: { tags: true },
      infiniteQueryKeys: { tags: true },
    },
  ],
});
