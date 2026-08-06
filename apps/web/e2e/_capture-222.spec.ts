import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#222). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-222";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

const RECENT_LOGIN_KEY = "bb.recentLogin";
const UNAUTH_HEADER = { "x-mock-scenario": "unauthenticated" };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await page.setExtraHTTPHeaders(UNAUTH_HEADER);
});

test("01 첫 로그인 데스크톱 애플 버튼", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/login");
  await page.getByRole("button", { name: "애플로 시작하기" }).waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/01-login-desktop.png`, fullPage: true });
});

test("02 첫 로그인 모바일 애플 버튼", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/login");
  await page.getByRole("button", { name: "애플로 시작하기" }).waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/02-login-mobile.png`, fullPage: true });
});

test("03 최근 로그인 카드 애플 배지", async ({ page }) => {
  await page.addInitScript(
    ([key, value]) => {
      window.localStorage.setItem(key, value);
    },
    [
      RECENT_LOGIN_KEY,
      JSON.stringify({
        provider: "apple",
        maskedEmail: "yun***@example.com",
        lastLoginAt: "2026-07-29T09:00:00Z",
      }),
    ] as const,
  );
  await page.setViewportSize(DESKTOP);
  await page.goto("/login");
  await page.getByText("애플 · yun***@example.com").waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/03-login-recent-apple-desktop.png`, fullPage: true });
});
