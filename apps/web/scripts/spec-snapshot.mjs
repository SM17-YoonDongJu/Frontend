// 백엔드 OpenAPI 스펙 스냅샷을 레포에 고정하고, 원격 스펙과의 드리프트를 감지한다.
//
// 코드 생성(generate:api)은 이 스냅샷을 입력으로 쓴다 — 원격 dev 서버 상태에 따라
// 생성물이 흔들리지 않게 하고, 스펙 변경을 커밋 diff로 남기기 위해서.
// 백엔드가 스펙을 바꾸면 CI(api-spec-drift 워크플로)가 먼저 발견한다.
//
// 사용 (PowerShell 툴에서 — Bash 툴은 node가 PATH에 없음):
//   node scripts/spec-snapshot.mjs --write   원격 스펙을 받아 스냅샷 갱신 (pnpm spec:pull)
//   node scripts/spec-snapshot.mjs --check   원격과 스냅샷 비교, 다르면 exit 1 (CI)

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";

const SPEC_URL = process.env.OPENAPI_SPEC_URL ?? "https://api-dev.brbosang.com/v3/api-docs";
const SNAPSHOT = resolve(process.cwd(), "openapi/api-docs.json");

const mode = process.argv[2];
if (mode !== "--write" && mode !== "--check") {
  console.error("사용법: node scripts/spec-snapshot.mjs --write | --check");
  process.exit(2);
}

/**
 * 원본 키 순서를 보존한 채 들여쓰기만 넣는다.
 * 정렬하면 생성물(sdk·types·zod)의 선언 순서까지 통째로 재배열돼 diff가 폭발한다.
 */
function pretty(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

// fetch 이후엔 process.exit()를 쓰지 않는다 — 열린 undici 핸들이 남아 Windows Node가
// libuv 어서션으로 죽고 종료코드가 오염된다. exitCode만 세우고 자연 종료시킨다.
const res = await fetch(SPEC_URL);
if (!res.ok) {
  console.error(`스펙을 받지 못했다: ${SPEC_URL} → ${res.status}`);
  process.exitCode = 1;
} else {
  const remote = pretty(await res.json());

  if (mode === "--write") {
    mkdirSync(dirname(SNAPSHOT), { recursive: true });
    writeFileSync(SNAPSHOT, remote);
    console.log(`spec-snapshot: ${SPEC_URL} → openapi/api-docs.json 갱신`);
  } else if (readFileSync(SNAPSHOT, "utf8") === remote) {
    console.log("spec-snapshot: 원격 스펙과 스냅샷 일치");
  } else {
    console.error(
      [
        "백엔드 OpenAPI 스펙이 스냅샷과 다르다.",
        "",
        "  pnpm --filter @insurance/web spec:pull    # 스냅샷 갱신",
        "  pnpm --filter @insurance/web generate:api # 생성물 재생성",
        "",
        "두 변경을 함께 커밋하고, 수동 zod 스키마·MSW 핸들러에 영향이 있는지 확인하라.",
      ].join("\n"),
    );
    process.exitCode = 1;
  }
}
