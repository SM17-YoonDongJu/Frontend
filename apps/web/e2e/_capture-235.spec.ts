import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#235). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-235";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

test("01 로그인 화면 약관 링크 데스크톱", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
  await page.setViewportSize(DESKTOP);
  await page.goto("/login");
  await page.getByRole("link", { name: "이용약관" }).waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/01-login-desktop.png` });
});

test("02 로그인 화면 약관 링크 모바일", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
  await page.setViewportSize(MOBILE);
  await page.goto("/login");
  await page.getByRole("link", { name: "서비스 이용약관" }).waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/02-login-mobile.png` });
});

test("03 고객 마이페이지 설정 목록", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/customer/mypage");
  const section = page.locator("section").filter({ hasText: "내 정보 · 설정" }).last();
  await section.getByRole("link", { name: "이용약관" }).waitFor({ timeout: 15000 });
  await section.screenshot({ path: `${DIR}/03-customer-mypage-mobile.png` });
});

test("04 파트너 마이페이지 메뉴", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/partner/mypage");
  const menu = page.getByRole("navigation").last();
  await menu.getByRole("link", { name: "이용약관" }).waitFor({ timeout: 15000 });
  await menu.screenshot({ path: `${DIR}/04-partner-mypage-mobile.png` });
});
