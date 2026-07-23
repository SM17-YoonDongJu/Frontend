import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#168). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-168";

const MOBILE = { width: 390, height: 900 };
const DESKTOP = { width: 1280, height: 900 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

test("01 랜딩 헤더 PC", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  await page.getByRole("link", { name: "서비스 소개" }).first().waitFor();
  await page.locator("header").screenshot({ path: `${DIR}/01-header-pc.png` });
});

test("02 랜딩 푸터 PC", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.locator("footer").screenshot({ path: `${DIR}/02-footer-pc.png` });
});

test("03 랜딩 푸터 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/");
  await page.locator("footer").scrollIntoViewIfNeeded();
  await page.locator("footer").screenshot({ path: `${DIR}/03-footer-mobile.png` });
});
