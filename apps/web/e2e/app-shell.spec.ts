import { expect, test, type Page } from "@playwright/test";

/**
 * 앱(WebView) 셸 E2E (이슈 #103) — 웹 헤더·푸터 숨김 + 역할별 하단 탭바.
 *
 * 원칙: 사용자가 보는 결과(헤더/푸터/탭바 노출·활성 탭)만 검증. 셀렉터는 role·텍스트.
 * 앱 감지 = 컨텍스트 UA에 "BareunApp/1.0" suffix — SSR 최초 요청부터 실려 서버가 헤더·푸터를 미렌더한다.
 * 데스크톱(suffix 없음)은 회귀로 기존 헤더·푸터 유지를 확인한다.
 * 인증: 기본 MSW GET /users/me → insured_person(윤서). 사정사는 localStorage["mock:userType"]="adjuster",
 *       비로그인은 x-mock-scenario:unauthenticated 헤더로 401(repo 표준 주입 — MSW 워커가 fetch를 가로채 page.route 불가).
 * 정적 위임(미테스트): 토큰 스타일·safe-area·아이콘 형상은 Storybook·figma 게이트에 위임.
 */

const APP_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 BareunApp/1.0";
const DESKTOP_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const MOBILE_VIEWPORT = { width: 390, height: 844 };
const DESKTOP_VIEWPORT = { width: 1280, height: 900 };

const CUSTOMER_TAB_LABELS = ["홈", "리포트", "채팅", "내정보"];
const PARTNER_TAB_LABELS = ["홈", "검수", "채팅", "내정보"];

// 탭바 = "내정보" 링크를 가진 navigation 영역(헤더의 nav와 구분되는 유일 신호).
function tabBar(page: Page) {
  return page
    .getByRole("navigation")
    .filter({ has: page.getByRole("link", { name: "내정보", exact: true }) });
}

// 탭바는 useAuthStatus(GET /users/me) 응답 후 노출 여부가 확정된다.
// 부재 단언이 인증 확정 전에 조기 통과하지 않도록 응답을 기다린 뒤 진행한다.
async function gotoAwaitingMe(page: Page, path: string) {
  const me = page.waitForResponse((res) => res.url().includes("/users/me"));
  await page.goto(path);
  await me;
}

test.describe("고객 · 앱 UA", () => {
  test.use({ userAgent: APP_UA, viewport: MOBILE_VIEWPORT });

  test("로그인 상태로 대시보드에 들어가면 헤더·푸터 없이 4탭 탭바가 보이고 홈이 활성이다", async ({
    page,
  }) => {
    await page.goto("/customer/dashboard");

    const bar = tabBar(page);
    await expect(bar).toBeVisible();
    for (const label of CUSTOMER_TAB_LABELS) {
      await expect(bar.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await expect(bar.getByRole("link", { name: "홈", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );

    // 앱에서는 웹 헤더(banner)·푸터(contentinfo)가 렌더되지 않는다.
    await expect(page.getByRole("banner")).toHaveCount(0);
    await expect(page.getByRole("contentinfo")).toHaveCount(0);
  });

  test("리포트 상세에 들어가면 탭바가 숨겨진다", async ({ page }) => {
    await gotoAwaitingMe(page, "/customer/report/test-id-123");
    await expect(tabBar(page)).toHaveCount(0);
  });

  test("분석 신청 퍼널에 들어가면 탭바가 숨겨진다", async ({ page }) => {
    await gotoAwaitingMe(page, "/customer/adjust-request");
    await expect(tabBar(page)).toHaveCount(0);
  });

  test("비로그인 상태면 탭바가 보이지 않는다", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
    await gotoAwaitingMe(page, "/customer/dashboard");
    await expect(tabBar(page)).toHaveCount(0);
  });
});

test.describe("사정사 · 앱 UA", () => {
  test.use({ userAgent: APP_UA, viewport: MOBILE_VIEWPORT });

  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("mock:userType", "adjuster");
    });
  });

  test("사정사로 홈에 들어가면 검수 포함 4탭 탭바가 보이고 홈이 활성이다", async ({
    page,
  }) => {
    await page.goto("/partner");

    const bar = tabBar(page);
    await expect(bar).toBeVisible();
    for (const label of PARTNER_TAB_LABELS) {
      await expect(bar.getByRole("link", { name: label, exact: true })).toBeVisible();
    }
    await expect(bar.getByRole("link", { name: "홈", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );

    await expect(page.getByRole("banner")).toHaveCount(0);
    await expect(page.getByRole("contentinfo")).toHaveCount(0);
  });

  test("검수 상세에 들어가면 탭바가 숨겨진다", async ({ page }) => {
    await gotoAwaitingMe(page, "/partner/review/11111111-1111-4111-8111-111111111111");
    await expect(tabBar(page)).toHaveCount(0);
  });

  test("검수 내역(마이페이지 하위)에 들어가면 탭바가 숨겨진다", async ({ page }) => {
    await gotoAwaitingMe(page, "/partner/mypage/review-history");
    await expect(tabBar(page)).toHaveCount(0);
  });
});

test.describe("데스크톱 회귀 · 일반 UA", () => {
  test.use({ userAgent: DESKTOP_UA, viewport: DESKTOP_VIEWPORT });

  test("데스크톱에서는 헤더·푸터가 유지되고 탭바가 없다", async ({ page }) => {
    await gotoAwaitingMe(page, "/customer/dashboard");

    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
    await expect(tabBar(page)).toHaveCount(0);
  });
});

test.describe("랜딩 · 앱 UA", () => {
  test.use({ userAgent: APP_UA, viewport: MOBILE_VIEWPORT });

  test("앱에서 랜딩에 들어가면 랜딩 헤더·푸터가 없다", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: /놓친 만큼 찾아드립니다/ }),
    ).toBeVisible();
    await expect(page.getByRole("banner")).toHaveCount(0);
    await expect(page.getByRole("contentinfo")).toHaveCount(0);
  });
});
