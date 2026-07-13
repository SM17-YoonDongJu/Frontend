import { test } from "@playwright/test";

/** PR 스크린샷 캡처 헬퍼(#108). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-108";

test.use({ viewport: { width: 1280, height: 900 } });

test("01 비로그인 로그인 화면", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
  await page.goto("/login");
  await page.getByRole("heading", { name: "바른보상 시작하기" }).waitFor();
  await page.screenshot({ path: `${DIR}/01-login-unauthenticated.png` });
});

test("02 로그인 유저 진입 시 고객 대시보드", async ({ page }) => {
  await page.goto("/login");
  await page.waitForURL(/\/customer\/dashboard/);
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: `${DIR}/02-login-redirect-customer.png` });
});

test("03 사정사 진입 시 파트너 홈", async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.setItem("mock:userType", "adjuster");
  });
  await page.goto("/login");
  await page.waitForURL(/\/partner/);
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: `${DIR}/03-login-redirect-partner.png` });
});

test("04 확인 실패 시 로그인 화면 유지", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-failure": "me" });
  await page.goto("/login");
  await page.getByRole("heading", { name: "바른보상 시작하기" }).waitFor();
  await page.screenshot({ path: `${DIR}/04-login-me-failure.png` });
});
