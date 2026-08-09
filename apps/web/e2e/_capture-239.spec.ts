import { test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/** PR #239 스크린샷 캡처 전용(CI 제외). */

const PATH = "/customer/dashboard";

test.use({ viewport: { width: 1280, height: 900 } });

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
});

test("01 온보딩 히어로 배지 제거", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "dashboard-onboarding" });
  await page.goto(PATH);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: ".gallery/239-01-hero.png", fullPage: false });
});

test("02 추천 사정사 빈 상태(온보딩)", async ({ page }) => {
  await page.setExtraHTTPHeaders({
    "x-mock-scenario": "dashboard-onboarding",
    "x-mock-adjusters": "empty",
  });
  await page.goto(PATH);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: ".gallery/239-02-onboarding-empty.png", fullPage: true });
});

test("03 추천 카드 빈 상태(대시보드)", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-adjusters": "empty" });
  await page.goto(PATH);
  await page.waitForTimeout(2500);
  await page.screenshot({ path: ".gallery/239-03-recommend-empty.png", fullPage: true });
});
