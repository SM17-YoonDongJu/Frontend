/**
 * 토큰 만료·재발급 시나리오 상태 (#109). MSW 워커가 브라우저에서 돌므로 localStorage를 주입 채널로 쓴다.
 *
 * - `mock:tokenExpired` = "once"            → 보호 엔드포인트 첫 호출 401 EXPIRED_TOKEN, 재발급 성공 후 200
 * - `mock:tokenExpired` = "refresh-expired" → 보호 엔드포인트 401 EXPIRED_TOKEN, 재발급도 401 EXPIRED_TOKEN
 * - `mock:reissueCount`                     → /auth/reissue 실제 호출 횟수(단일-flight 검증용)
 * - `mock:expiredResponseCount`             → 보호 엔드포인트가 401 EXPIRED_TOKEN을 돌려준 횟수(#224).
 *   Playwright `page.on("response")`는 WebKit에서 서비스워커 경유 응답 이벤트를 흘리지 않아
 *   E2E 관측 채널을 MSW 쪽 localStorage로 둔다.
 * - `mock:loggedOut` = "true"               → 로그아웃 상태(#155), 보호 엔드포인트가 401 LOGIN_REQUIRED
 *
 * 플래그가 없으면 만료 없음 = 기존 동작 그대로.
 */
const SCENARIO_KEY = "mock:tokenExpired";
const REISSUE_COUNT_KEY = "mock:reissueCount";
const EXPIRED_COUNT_KEY = "mock:expiredResponseCount";
const LOGGED_OUT_KEY = "mock:loggedOut";

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

export function setLoggedOut(): void {
  write(LOGGED_OUT_KEY, "true");
}

export function isLoggedOut(): boolean {
  return read(LOGGED_OUT_KEY) === "true";
}

export function reissueCallCount(): number {
  const count = Number.parseInt(read(REISSUE_COUNT_KEY) ?? "0", 10);
  return Number.isNaN(count) ? 0 : count;
}

export function recordExpiredResponse(): void {
  write(EXPIRED_COUNT_KEY, String(expiredResponseCount() + 1));
}

export function expiredResponseCount(): number {
  const count = Number.parseInt(read(EXPIRED_COUNT_KEY) ?? "0", 10);
  return Number.isNaN(count) ? 0 : count;
}

/**
 * 보호 엔드포인트 만료 응답이 min회 쌓일 때까지 재발급 완료를 미룬다(#224).
 * 재발급이 먼저 끝나 만료 플래그가 풀리면 나중에 나간 요청이 401 없이 200을 받아
 * "동시 만료" 전제가 타이밍에 따라 무너지므로 붙인 대기다.
 * 동시 만료를 검증하는 "once" 시나리오에서만 돌고(refresh-expired는 보호 요청이 1개인
 * 화면도 거쳐 대기가 지연만 만든다), 상한을 넘기면 그대로 진행해 다른 흐름을 막지 않는다.
 */
export async function waitForExpiredResponses(min: number, timeoutMs: number): Promise<void> {
  if (readScenario() !== "once") return;

  const deadline = Date.now() + timeoutMs;
  while (expiredResponseCount() < min && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
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
