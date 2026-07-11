import { expect, test } from "@playwright/test";

/**
 * 온보딩(랜딩) 페이지 E2E (happy-path, 이슈 #96).
 *
 * 원칙: 핵심 사용자 흐름만 — 비로그인 진입 시 랜딩 렌더 + CTA→/login 이동 / 로그인 시 대시보드 리다이렉트.
 * 비로그인은 GET /users/me를 401(LOGIN_REQUIRED)로 override(x-mock-scenario:unauthenticated 헤더 —
 * MSW 서비스워커가 fetch를 가로채 page.route로는 override 불가하므로 repo 표준 헤더 주입 패턴 사용).
 * 로그인은 기본 MSW 핸들러(GET /users/me → 윤서, userType insured_person → /customer/dashboard).
 * PC/모바일 변형은 별도 DOM(hidden md:block / md:hidden)이라 뷰포트를 고정해 결정적으로 검증한다.
 * 정적 카피 전수·토큰 스타일 검증은 figma 게이트·수동 대조에 위임(미테스트).
 */

const PATH = "/";
const UNAUTH_HEADER = { "x-mock-scenario": "unauthenticated" };

test.describe("비로그인 랜딩 — PC", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("진입하면 PC 히어로 H1이 보인다", async ({ page }) => {
    await page.setExtraHTTPHeaders(UNAUTH_HEADER);
    await page.goto(PATH);

    await expect(page.getByRole("heading", { name: /받은 보험금/ })).toBeVisible();
  });

  test("내 보상 분석하기를 누르면 로그인으로 이동한다", async ({ page }) => {
    await page.setExtraHTTPHeaders(UNAUTH_HEADER);
    await page.goto(PATH);

    await expect(async () => {
      await page.getByRole("link", { name: /내 보상 분석하기/ }).first().click();
      await expect(page).toHaveURL(/\/login/);
    }).toPass({ timeout: 10000 });
  });
});

test.describe("비로그인 랜딩 — 모바일", () => {
  test.use({ viewport: { width: 400, height: 900 } });

  test("진입하면 모바일 히어로 문구가 보인다", async ({ page }) => {
    await page.setExtraHTTPHeaders(UNAUTH_HEADER);
    await page.goto(PATH);

    await expect(
      page.getByRole("heading", { name: /받아야 할 보상/ }),
    ).toBeVisible();
  });

  test("무료로 분석 시작하기를 누르면 로그인으로 이동한다", async ({ page }) => {
    await page.setExtraHTTPHeaders(UNAUTH_HEADER);
    await page.goto(PATH);

    await expect(async () => {
      await page.getByRole("link", { name: /무료로 분석 시작하기/ }).click();
      await expect(page).toHaveURL(/\/login/);
    }).toPass({ timeout: 10000 });
  });
});

test.describe("로그인 리다이렉트", () => {
  test("로그인 유저가 진입하면 고객 대시보드로 이동한다", async ({ page }) => {
    await page.goto(PATH);

    await expect(page).toHaveURL(/\/customer\/dashboard/, { timeout: 10000 });
  });
});
