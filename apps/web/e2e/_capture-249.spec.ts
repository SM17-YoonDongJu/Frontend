import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#249). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-249";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
});

test("01 계정 삭제 안내 데스크톱", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/account-deletion");
  await page.getByRole("heading", { name: "계정 삭제 안내" }).waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/01-account-deletion-desktop.png`, fullPage: true });
});

test("02 계정 삭제 안내 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/account-deletion");
  await page.getByRole("heading", { name: "계정 삭제 안내" }).waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/02-account-deletion-mobile.png`, fullPage: true });
});

test("03 랜딩 푸터 계정 삭제 링크", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await footer.getByRole("link", { name: "계정 삭제" }).waitFor({ timeout: 15000 });
  await footer.screenshot({ path: `${DIR}/03-landing-footer.png` });
});

test("04 문의하기 계정 삭제 안내 링크", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/contact");
  await page.getByRole("link", { name: "계정 삭제 안내" }).waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/04-contact-link-desktop.png`, fullPage: true });
});
