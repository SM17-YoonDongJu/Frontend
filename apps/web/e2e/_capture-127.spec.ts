import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#127). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-127";
const REPORT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PATH = `/customer/proposals/${REPORT_ID}`;

const MOBILE = { width: 390, height: 900 };
const DESKTOP = { width: 1280, height: 900 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await page.addInitScript(() => {
    const originalFetch = window.fetch;
    window.fetch = (input, init = {}) => {
      const headers = new Headers(init.headers);
      headers.set("x-mock-failure", "match-proposal");
      return originalFetch(input, { ...init, headers });
    };
  });
});

async function triggerFailureToast(page: import("@playwright/test").Page) {
  await page.goto(PATH);
  const card = page.getByRole("listitem").filter({ hasText: "김도현" });
  await card.getByRole("button", { name: "상담 수락" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "매칭 완료" }).click();
  await page
    .getByRole("alert")
    .filter({ hasText: "제안 채택에 실패했어요" })
    .waitFor();
}

test("01 모바일 채택 실패 토스트", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await triggerFailureToast(page);
  await page.screenshot({ path: `${DIR}/01-toast-error-mobile.png` });
});

test("02 데스크톱 채택 실패 토스트", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await triggerFailureToast(page);
  await page.screenshot({ path: `${DIR}/02-toast-error-desktop.png` });
});
