import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#262). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-262";

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await setAuthCookie(page, "USER");
});

test.describe("데스크톱", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("01 내 리포트 목록", async ({ page }) => {
    await page.goto("/customer/reports");
    await expect(page.getByRole("heading", { name: "내 리포트" })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("No.20260520-017")).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: `${DIR}/01-report-list-desktop.png` });
  });

  test("02 마이페이지 사이드바", async ({ page }) => {
    await page.goto("/customer/mypage");
    await expect(
      page.getByRole("link", { name: /내 분석 리포트/ }).filter({ visible: true }),
    ).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: `${DIR}/02-mypage-sidebar-desktop.png` });
  });
});

test.describe("모바일", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("03 내 리포트 목록", async ({ page }) => {
    await page.goto("/customer/reports");
    await expect(page.getByRole("heading", { name: "내 리포트" })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText("No.20260520-017")).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: `${DIR}/03-report-list-mobile.png` });
  });

  test("04 마이페이지 보상 활동", async ({ page }) => {
    await page.goto("/customer/mypage");
    await expect(page.getByText("보상 활동").filter({ visible: true })).toBeVisible({
      timeout: 15000,
    });
    await page.screenshot({ path: `${DIR}/04-mypage-activity-mobile.png` });
  });
});
