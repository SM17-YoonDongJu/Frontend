import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#229). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-229";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
});

test("01 랜딩 푸터 데스크톱", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await footer.getByRole("link", { name: "이용약관" }).waitFor({ timeout: 15000 });
  await footer.screenshot({ path: `${DIR}/01-landing-footer-desktop.png` });
});

test("02 랜딩 푸터 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  const footer = page.getByRole("contentinfo");
  await footer.getByRole("link", { name: "이용약관" }).waitFor({ timeout: 15000 });
  await footer.screenshot({ path: `${DIR}/02-landing-footer-mobile.png` });
});
