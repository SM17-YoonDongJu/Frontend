import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * 액세스 토큰 자동 재발급·요청 재시도 E2E (이슈 #109).
 *
 * 원칙: 사용자 관점 — 만료돼도 화면이 그대로 뜬다 / 리프레시까지 만료면 로그인 안내 화면으로 이동한다(#145).
 * 만료는 MSW 시나리오 주입(localStorage "mock:tokenExpired": "once" | "refresh-expired").
 * 보호 엔드포인트 GET /users/me·GET /reports가 401 EXPIRED_TOKEN을 주고, POST /auth/reissue 실제 호출
 * 횟수는 localStorage "mock:reissueCount"에 누적된다(단일-flight 관측 채널).
 * 401 응답 횟수도 MSW가 localStorage "mock:expiredResponseCount"에 누적한다(#224) —
 * page.on("response")는 WebKit에서 서비스워커 경유 응답 이벤트를 흘리지 않아 관측 채널로 못 쓴다.
 * 동시 401은 대시보드가 프로덕션 경로 그대로 만든다 — 진입 시 useMe(/users/me)와 useReportList(/reports)가
 * 나란히 나가고 둘 다 401을 받으므로, fetchJson 두 곳이 같은 재발급 promise를 공유하는지 검증된다.
 * 재발급 응답 형식·에러코드 enum 검증은 zod·api-spec 훅에 위임(미테스트).
 */

const DASHBOARD_PATH = "/customer/dashboard";
const LOGIN_PATH = "/login";
const SCENARIO_KEY = "mock:tokenExpired";
const REISSUE_COUNT_KEY = "mock:reissueCount";
const EXPIRED_COUNT_KEY = "mock:expiredResponseCount";
const RECENT_LOGIN_KEY = "bb.recentLogin";

// 대시보드 데스크톱 뷰(<md는 모바일 홈)를 기준으로 검증한다 — dashboard.spec.ts와 동일 패턴.
test.use({ viewport: { width: 1280, height: 900 } });

type Page = import("@playwright/test").Page;

async function injectScenario(page: Page, scenario: string | null) {
  await page.addInitScript(
    ([scenarioKey, countKey, expiredKey, value]) => {
      window.localStorage.removeItem(countKey);
      window.localStorage.removeItem(expiredKey);
      if (value === null) window.localStorage.removeItem(scenarioKey);
      else window.localStorage.setItem(scenarioKey, value);
    },
    [SCENARIO_KEY, REISSUE_COUNT_KEY, EXPIRED_COUNT_KEY, scenario] as const,
  );
}

function reissueCount(page: Page) {
  return page.evaluate((key) => window.localStorage.getItem(key), REISSUE_COUNT_KEY);
}

test("액세스 토큰이 만료돼도 자동 재발급 후 대시보드가 정상으로 보인다", async ({ page }) => {
  await setAuthCookie(page, "USER");
  await injectScenario(page, "once");

  await page.goto(DASHBOARD_PATH);

  // 인사(/users/me)와 내 분석 리포트(/reports)가 모두 재발급 후 재시도로 살아나야 화면이 뜬다.
  await expect(
    page.getByRole("heading", { name: "안녕하세요, 윤서님" }).filter({ visible: true }),
  ).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole("heading", { name: "내 분석 리포트" })).toBeVisible();
  await expect(page.getByText("김도현 사정사").filter({ visible: true })).toBeVisible();
  await expect(page).toHaveURL(/\/customer\/dashboard/);
});

test("여러 요청이 동시에 만료 응답을 받아도 재발급은 한 번만 호출된다", async ({ page }) => {
  await setAuthCookie(page, "USER");
  await injectScenario(page, "once");

  await page.goto(DASHBOARD_PATH);

  // 인사말(/users/me)과 리포트 목록(/reports)이 모두 재시도로 살아났다 = 두 요청 다 401 → 재발급 → 재시도.
  await expect(
    page.getByRole("heading", { name: "안녕하세요, 윤서님" }).filter({ visible: true }),
  ).toBeVisible({ timeout: 15000 });
  await expect(page.getByText("김도현 사정사").filter({ visible: true })).toBeVisible();

  await expect(async () => {
    expect(await reissueCount(page)).toBe("1");
  }).toPass({ timeout: 10000 });

  // 실제로 두 개 이상의 요청이 401을 받았는지(=동시 만료 상황이 재현됐는지) 확인해 둔다.
  // 이게 없으면 요청 하나만 401을 받고도 테스트가 통과해 단일-flight를 검증하지 못한다.
  await expect(async () => {
    const count = await page.evaluate((key) => window.localStorage.getItem(key), EXPIRED_COUNT_KEY);
    expect(Number(count ?? "0")).toBeGreaterThanOrEqual(2);
  }).toPass({ timeout: 10000 });
});

test("리프레시 토큰까지 만료되면 로그인 안내 화면을 거쳐 로그인 화면에 최근 로그인 카드가 남는다", async ({
  page,
}) => {
  await injectScenario(page, "refresh-expired");
  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value);
    },
    [
      RECENT_LOGIN_KEY,
      JSON.stringify({
        provider: "kakao",
        maskedEmail: "yun***@example.com",
        lastLoginAt: "2026-05-20T09:00:00Z",
      }),
    ] as const,
  );

  await page.goto(DASHBOARD_PATH);

  await expect(page).toHaveURL(/\/login-required/, { timeout: 20000 });
  const loginLink = page.getByRole("link", { name: "로그인하러 가기" });
  await expect(async () => {
    await loginLink.click();
    await expect(page).toHaveURL(/\/login(?!-required)/);
  }).toPass({ timeout: 15000 });
  await expect(page.getByRole("heading", { name: "다시 만나서 반가워요" })).toBeVisible();
  await expect(page.getByRole("button", { name: "카카오로 계속하기" })).toBeVisible();
  await expect(page.getByText("카카오 · yun***@example.com")).toBeVisible();
});

test("만료가 아니면 재발급을 호출하지 않고 대시보드가 그대로 보인다", async ({ page }) => {
  await setAuthCookie(page, "USER");
  await injectScenario(page, null);

  await page.goto(DASHBOARD_PATH);

  await expect(
    page.getByRole("heading", { name: "안녕하세요, 윤서님" }).filter({ visible: true }),
  ).toBeVisible({ timeout: 15000 });
  expect(await reissueCount(page)).toBeNull();
});

test("비로그인 사용자는 재발급 없이 랜딩이 그대로 보인다", async ({ page }) => {
  // 401 LOGIN_REQUIRED(비로그인)는 재발급 대상이 아니다 — 랜딩 fail-open 회귀 가드.
  await injectScenario(page, null);
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });

  await page.goto("/");

  await expect(page.getByRole("heading", { name: /받은 보험금/ })).toBeVisible({
    timeout: 15000,
  });
  await expect(page).not.toHaveURL(new RegExp(LOGIN_PATH));
  expect(await reissueCount(page)).toBeNull();
});
