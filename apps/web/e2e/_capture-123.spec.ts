import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#123). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-123";
const REPORT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PATH = `/customer/proposals/${REPORT_ID}`;

const MOBILE = { width: 390, height: 900 };
const DESKTOP = { width: 1280, height: 900 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

test("01 모바일 제안 목록", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto(PATH);
  await page.getByText("김도현").waitFor();
  await page.screenshot({ path: `${DIR}/01-proposals-mobile.png`, fullPage: true });
});

test("02 모바일 제안 카드", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto(PATH);
  const card = page.getByRole("listitem").filter({ hasText: "김도현" });
  await card.waitFor();
  await card.screenshot({ path: `${DIR}/02-card-mobile.png` });
});

test("03 데스크톱 제안 목록", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(PATH);
  await page.getByText("김도현").waitFor();
  await page.screenshot({ path: `${DIR}/03-proposals-desktop.png` });
});
