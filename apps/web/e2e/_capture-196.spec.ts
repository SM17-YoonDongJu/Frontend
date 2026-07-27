import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#196). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-196";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

test("01 대시보드 액션센터 데스크톱", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/customer/dashboard");
  await page.getByRole("heading", { name: /새 제안 3건이 도착했어요/ }).filter({ visible: true }).waitFor();
  await page.screenshot({ path: `${DIR}/01-dashboard-desktop.png` });
});

test("02 대시보드 액션센터 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/customer/dashboard");
  await page.getByText("지금 할 일").filter({ visible: true }).first().waitFor();
  await page.screenshot({ path: `${DIR}/02-dashboard-mobile.png` });
});
