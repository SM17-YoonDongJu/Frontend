import { expect, test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#162). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-162";

const MOBILE = { width: 390, height: 900 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await page.setViewportSize(MOBILE);
});

test("01 안읽음 2건 목록", async ({ page }) => {
  await page.goto("/notifications");
  await expect(page.getByLabel("읽지 않은 알림")).toHaveCount(2);
  await page.screenshot({ path: `${DIR}/01-unread-list-mobile.png`, fullPage: true });
});

test("02 카드 탭 후 읽음 전환", async ({ page }) => {
  await page.goto("/notifications");
  const unreadDots = page.getByLabel("읽지 않은 알림");
  await expect(unreadDots).toHaveCount(2);
  await expect(async () => {
    await page.getByRole("button", { name: "알림 읽음 처리" }).first().click();
    await expect(unreadDots).toHaveCount(1);
  }).toPass({ timeout: 10000 });
  await page.screenshot({ path: `${DIR}/02-after-tap-mobile.png`, fullPage: true });
});

test("03 실패 토스트", async ({ page }) => {
  await page.addInitScript(() => {
    const originalFetch = window.fetch;
    window.fetch = (input, init = {}) => {
      const headers = new Headers(init.headers);
      headers.set("x-mock-failure", "notification-read");
      return originalFetch(input, { ...init, headers });
    };
  });
  await page.goto("/notifications");
  await expect(async () => {
    await page.getByRole("button", { name: "알림 읽음 처리" }).first().click();
    await expect(page.getByText("알림 읽음 처리에 실패했어요", { exact: false })).toBeVisible();
  }).toPass({ timeout: 10000 });
  await page.screenshot({ path: `${DIR}/03-fail-toast-mobile.png`, fullPage: true });
});
