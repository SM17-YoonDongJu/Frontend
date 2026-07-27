import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#185). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-185";

const DESKTOP = { width: 1280, height: 900 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await page.setViewportSize(DESKTOP);
});

test("01 고객 헤더 — 로고가 대시보드로 연결", async ({ page }) => {
  await page.goto("/customer/dashboard");
  await page.getByRole("link", { name: "바른보상" }).first().waitFor();
  await page.locator("header").screenshot({ path: `${DIR}/01-customer-header.png` });
});

test("02 파트너 헤더 — 로고가 파트너 홈으로 연결", async ({ page }) => {
  await page.goto("/partner");
  await page.getByRole("link", { name: /바른보상/ }).first().waitFor();
  await page.locator("header").screenshot({ path: `${DIR}/02-partner-header.png` });
});

test("03 로그인 상태 /signup 진입 — 대시보드 도착", async ({ page }) => {
  await page.goto("/signup");
  await page.waitForURL(/\/customer\/dashboard/);
  await page.getByText("윤서").first().waitFor();
  await page.screenshot({ path: `${DIR}/03-signup-guard-redirect.png` });
});
