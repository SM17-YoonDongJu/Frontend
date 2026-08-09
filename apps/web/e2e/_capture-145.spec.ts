import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#145). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-145";
const PROTECTED_PATH = "/customer/dashboard";

const MOBILE = { width: 390, height: 900 };
const DESKTOP = { width: 1280, height: 900 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

test("01 로그인 안내 데스크톱", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
  await page.setViewportSize(DESKTOP);
  await page.goto(PROTECTED_PATH);
  await page
    .getByRole("heading", { name: "서비스를 이용하시려면 로그인이 필요합니다" })
    .waitFor();
  await page.screenshot({ path: `${DIR}/01-login-required-desktop.png`, fullPage: true });
});

test("02 로그인 안내 모바일", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
  await page.setViewportSize(MOBILE);
  await page.goto(PROTECTED_PATH);
  await page
    .getByRole("heading", { name: "서비스를 이용하시려면 로그인이 필요합니다" })
    .waitFor();
  await page.screenshot({ path: `${DIR}/02-login-required-mobile.png`, fullPage: true });
});

test("03 FORBIDDEN 기본 문구", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-failure": "reviewed-forbidden" });
  await page.setViewportSize(DESKTOP);
  await page.goto("/partner/mypage/review-history");
  await page.getByRole("heading", { name: "접근 권한이 없어요" }).waitFor({ timeout: 20000 });
  await page.screenshot({ path: `${DIR}/03-forbidden-desktop.png`, fullPage: true });
});
