import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * 고객 마이페이지 로그아웃 E2E (이슈 #155).
 *
 * 원칙: 핵심 사용자 흐름만 — PC 사이드바·모바일 하단 버튼으로 로그아웃하면 로그인 화면으로
 * 이동하고, 뒤로 가기로 보호 페이지에 돌아가도 이전 계정 데이터가 보이지 않는다(#148 안내 이동).
 * 로그아웃 성공 시 MSW가 localStorage["mock:loggedOut"]을 세팅해 보호 엔드포인트가 401을 돌려준다.
 * 서버 실패는 x-mock-failure=logout 헤더로 500을 강제 — 세션이 서버에 남아 로그인 게이트가
 * 홈으로 돌려보낼 수 있으므로(쿠키 기반 설계상 정상) 로그인 화면 이동 시도까지만 검증한다.
 * 로그인 화면 검증은 기본 변형(신규 가입 히어로 "바른보상 시작하기") 기준 — 최근 로그인 카드
 * 변형은 login.spec.ts가 다룬다. 응답 봉투·에러코드 enum 검증은 zod·api-spec 훅에 위임(미테스트).
 * PC/모바일 두 트리가 DOM에 공존(hidden md:grid / md:hidden)하므로 보이는 버튼만 filter로 지정한다.
 */

const MYPAGE_PATH = "/customer/mypage";

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
});

async function clickLogout(page: import("@playwright/test").Page) {
  const logoutButton = page
    .getByRole("button", { name: "로그아웃" })
    .filter({ visible: true });

  // 하이드레이션 가드 — 첫 클릭 유실 시 재시도
  await expect(async () => {
    await logoutButton.click();
    await expect(page).toHaveURL(/\/login$/, { timeout: 5000 });
  }).toPass({ timeout: 20000 });
}

test.describe("PC", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("사이드바 로그아웃을 누르면 로그인 화면으로 이동하고, 뒤로 가도 이전 화면이 보이지 않는다", async ({
    page,
  }) => {
    // 대시보드 → 마이페이지 히스토리를 쌓아 로그아웃 후 뒤로 가기 동작을 검증한다.
    await page.goto("/customer/dashboard");
    await expect(
      page.getByRole("heading", { name: "안녕하세요, 윤서님" }).filter({ visible: true }),
    ).toBeVisible({ timeout: 15000 });

    await page.goto(MYPAGE_PATH);
    await expect(page.getByRole("heading", { name: "윤서 님" })).toBeVisible();

    await clickLogout(page);
    await expect(
      page.getByRole("heading", { name: "바른보상 시작하기" }),
    ).toBeVisible();

    // 마이페이지는 히스토리에서 대체(location.replace)돼 뒤로 가면 그 앞의 보호 페이지(대시보드)로
    // 가고, 세션이 끝났으므로 이전 계정 데이터 대신 로그인 안내로 이동한다.
    await page.goBack();
    await expect(page).toHaveURL(/\/login-required/, { timeout: 20000 });
  });
});

test.describe("모바일", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("하단 로그아웃을 누르면 로그인 화면으로 이동한다", async ({ page }) => {
    await page.goto(MYPAGE_PATH);
    await expect(
      page.getByRole("heading", { level: 1, name: "내 정보" }).filter({ visible: true }),
    ).toBeVisible();

    await clickLogout(page);
    await expect(
      page.getByRole("heading", { name: "바른보상 시작하기" }),
    ).toBeVisible();
  });

  test("로그아웃 요청이 실패해도 마이페이지에 갇히지 않고 로그인 화면으로 이동한다", async ({
    page,
  }) => {
    await page.setExtraHTTPHeaders({ "x-mock-failure": "logout" });

    await page.goto(MYPAGE_PATH);
    await expect(
      page.getByRole("heading", { level: 1, name: "내 정보" }).filter({ visible: true }),
    ).toBeVisible();

    await clickLogout(page);
  });
});
