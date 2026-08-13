import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#272). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-272";
const LABEL = process.env.CAPTURE_LABEL ?? "after";

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await setAuthCookie(page, "USER");
});

test.describe("모바일", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("손해사정사 찾기 필터", async ({ page }) => {
    await page.goto("/customer/adjusters");
    await expect(page.getByRole("heading", { name: "손해사정사 찾기" })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByRole("button", { name: "실손" })).toBeVisible({
      timeout: 15000,
    });
    await page.screenshot({ path: `${DIR}/01-adjuster-filter-mobile-${LABEL}.png` });
  });
});
