// 생성 zod의 int64 → BigInt 강제 변환을 number로 되돌린다.
//
// 백엔드가 Long을 쓰면 springdoc이 format: int64로 내보내고, hey-api zod 플러그인은
// 이를 z.coerce.bigint()로 생성한다(플러그인 옵션으로 끌 수 없음 — format만 보고 동작).
// 실제 응답은 평범한 JSON 숫자이고 값도 전부 JS 안전 정수 범위(2^53) 안이라,
// BigInt로 바꾸면 얻는 것 없이 산술(amount / 10_000)·JSON.stringify만 깨진다.
// 같은 필드를 types.gen.ts는 number로 선언하고 있어 생성물끼리도 어긋난다.
//
// 근본 해결은 백엔드 스펙에서 format: int64를 걷어내는 것. 그전까지 이 스크립트가 막는다.
//
// 사용 (PowerShell 툴에서 — Bash 툴은 node가 PATH에 없음):
//   node scripts/patch-generated-zod.mjs
// generate:api가 자동으로 호출하므로 보통 직접 실행할 일은 없다.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const TARGET = resolve(process.cwd(), "src/shared/api/generated/zod.gen.ts");

// z.coerce.bigint() 뒤에 붙는 int64 범위 체이닝(.min(BigInt('...'), { error: '...' }) 등)까지 통째로 걷어낸다.
const BIGINT_CHAIN = /z\.coerce\.bigint\(\)(?:\.(?:min|max|gte|lte)\(BigInt\('-?\d+'\)(?:,\s*\{[^}]*\})?\))*/g;

// z.iso.datetime()은 기본이 Z만 허용한다 — 백엔드는 +09:00 오프셋도 내려주므로 그대로 두면
// 정상 응답이 검증에서 거부된다. 오프셋 허용으로 열어 준다.
const DATETIME = /z\.iso\.datetime\(\)/g;

const before = readFileSync(TARGET, "utf8");
const after = before
  .replace(BIGINT_CHAIN, "z.number().int()")
  .replace(DATETIME, "z.iso.datetime({ offset: true })");
const replaced = (before.match(BIGINT_CHAIN) ?? []).length;

if (after.includes("BigInt(")) {
  console.error("남은 BigInt가 있다 — 생성기 출력 형태가 바뀌었을 수 있으니 BIGINT_CHAIN 패턴을 확인하라.");
  process.exit(1);
}

if (before !== after) writeFileSync(TARGET, after);
console.log(`patch-generated-zod: ${replaced}개 필드를 z.number().int()로 치환`);
