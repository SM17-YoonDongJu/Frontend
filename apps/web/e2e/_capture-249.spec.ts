import { test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#249). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-249";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

test("01 계정 삭제 안내 데스크톱", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
  await page.setViewportSize(DESKTOP);
  await page.goto("/account-deletion");
  await page.getByRole("heading", { name: "계정 삭제 안내" }).waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/01-account-deletion-desktop.png`, fullPage: true });
});

test("02 계정 삭제 안내 모바일", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
  await page.setViewportSize(MOBILE);
  await page.goto("/account-deletion");
  await page.getByRole("heading", { name: "계정 삭제 안내" }).waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/02-account-deletion-mobile.png`, fullPage: true });
});

test("03 랜딩 푸터 계정 삭제 링크", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await footer.getByRole("link", { name: "계정 삭제" }).waitFor({ timeout: 15000 });
  await footer.screenshot({ path: `${DIR}/03-landing-footer.png` });
});

test("04 문의하기 계정 삭제 안내 링크", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
  await page.setViewportSize(DESKTOP);
  await page.goto("/contact");
  await page.getByRole("link", { name: "계정 삭제 안내" }).waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/04-contact-link-desktop.png`, fullPage: true });
});

test("05 탈퇴 화면 삭제 안내", async ({ page }) => {
  await setAuthCookie(page, "USER");
  await page.setViewportSize(DESKTOP);
  await page.goto("/withdraw");
  await page.getByRole("heading", { name: "탈퇴하면 이렇게 됩니다" }).waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/05-withdraw-notice-desktop.png`, fullPage: true });
});
