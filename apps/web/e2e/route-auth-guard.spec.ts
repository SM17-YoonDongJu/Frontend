import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * 서버 측 인증·역할 라우트 가드 E2E (이슈 #189).
 * 원칙: 화면 셸이 그려지기 전에 미들웨어가 막는지만 확인 — 데이터 상태는 다른 스펙이 담당.
 */

test("비로그인 상태로 보호 라우트에 직접 진입하면 로그인 안내 화면으로 이동한다", async ({
  page,
}) => {
  await page.goto("/partner/review");

  await expect(page).toHaveURL(/\/login-required/);
  await expect(
    page.getByRole("heading", { name: "서비스를 이용하시려면 로그인이 필요합니다" }),
  ).toBeVisible();
});

test("고객 계정으로 사정사 라우트에 진입하면 고객 홈으로 이동한다", async ({ page }) => {
  await setAuthCookie(page, "USER");
  await page.goto("/partner/review");

  await expect(page).toHaveURL(/\/customer\/dashboard/);
});

test("사정사 계정으로 고객 라우트에 진입하면 사정사 홈으로 이동한다", async ({ page }) => {
  await setAuthCookie(page, "CERTIFICATED_ADJUSTER");
  await page.goto("/customer/dashboard");

  await expect(page).toHaveURL(/\/partner$/);
});
