/**
 * 토큰 만료·재발급 시나리오 상태 (#109). MSW 워커가 브라우저에서 돌므로 localStorage를 주입 채널로 쓴다.
 *
 * - `mock:tokenExpired` = "once"            → 보호 엔드포인트 첫 호출 401 EXPIRED_TOKEN, 재발급 성공 후 200
 * - `mock:tokenExpired` = "refresh-expired" → 보호 엔드포인트 401 EXPIRED_TOKEN, 재발급도 401 EXPIRED_TOKEN
 * - `mock:reissueCount`                     → /auth/reissue 실제 호출 횟수(단일-flight 검증용)
 *
 * 플래그가 없으면 만료 없음 = 기존 동작 그대로.
 */
const SCENARIO_KEY = "mock:tokenExpired";
const REISSUE_COUNT_KEY = "mock:reissueCount";

type TokenScenario = "once" | "refresh-expired";

export type ReissueOutcome = "success" | "EXPIRED_TOKEN" | "LOGIN_REQUIRED";

function read(key: string): string | null {
  if (typeof localStorage === "undefined") return null;
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // no-op
  }
}

function remove(key: string): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch {
    // no-op
  }
}

function readScenario(): TokenScenario | null {
  const raw = read(SCENARIO_KEY);
  if (raw === "once" || raw === "refresh-expired") return raw;
  return null;
}

export function isAccessTokenExpired(): boolean {
  return readScenario() !== null;
}

export function reissueCallCount(): number {
  const count = Number.parseInt(read(REISSUE_COUNT_KEY) ?? "0", 10);
  return Number.isNaN(count) ? 0 : count;
}

/** 재발급 1회 처리. "once"면 만료 상태를 해제해 이후 보호 엔드포인트가 200을 돌려준다. */
export function consumeReissue(): ReissueOutcome {
  write(REISSUE_COUNT_KEY, String(reissueCallCount() + 1));

  const scenario = readScenario();
  if (scenario === "once") {
    remove(SCENARIO_KEY);
    return "success";
  }
  if (scenario === "refresh-expired") return "EXPIRED_TOKEN";
  return "LOGIN_REQUIRED";
}
