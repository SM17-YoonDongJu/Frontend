import { test, expect, type Page } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#326). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-326";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

const PATH = "/partner/review";

/** 한 페이지(20건)를 넘는 25건 시나리오 — MSW는 서비스워커라 fetch를 감싸 헤더를 싣는다. */
async function useManyScenario(page: Page) {
  await page.addInitScript(() => {
    const originalFetch = window.fetch;
    window.fetch = (input, init = {}) => {
      const headers = new Headers(init.headers);
      headers.set("x-mock-scenario", "pending-review-many");
      return originalFetch(input, { ...init, headers });
    };
  });
}

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "CERTIFICATED_ADJUSTER");
  await hideQueryDevtools(page);
});

test("01 PC 검수 대기 — 첫 페이지 20건과 더보기", async ({ page }) => {
  await useManyScenario(page);
  await page.setViewportSize(DESKTOP);
  await page.goto(PATH);
  await expect(page.getByRole("button", { name: "더보기" })).toBeVisible();
  await page.screenshot({ path: `${DIR}/01-desktop-first-page.png`, fullPage: true });
});

test("02 PC 검수 대기 — 더보기 후 마지막 페이지", async ({ page }) => {
  await useManyScenario(page);
  await page.setViewportSize(DESKTOP);
  await page.goto(PATH);
  const loadMore = page.getByRole("button", { name: "더보기" });
  await expect(async () => {
    await loadMore.click();
    await expect(page.getByText("검수 대기 사건 25").filter({ visible: true })).toBeVisible({
      timeout: 3000,
    });
  }).toPass({ timeout: 15000 });
  await expect(loadMore).toHaveCount(0);
  await page.screenshot({ path: `${DIR}/02-desktop-last-page.png`, fullPage: true });
});

test("03 PC 지역 필터 — 서울 서초구 선택", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(PATH);
  await expect(async () => {
    await page.getByLabel("지역 필터").selectOption("서울 서초구");
    await expect(page).toHaveURL(/[?&]region=/);
  }).toPass({ timeout: 10000 });
  await expect(
    page.getByText("경추 염좌 · 향후 치료비 미반영").filter({ visible: true }),
  ).toHaveCount(0);
  await page.screenshot({ path: `${DIR}/03-desktop-region-filter.png`, fullPage: true });
});

test("04 PC 상태 탭 — 실제 존재하는 상태만", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(PATH);
  await expect(page.getByRole("tab", { name: "전송 완료" })).toBeVisible();
  await page.screenshot({ path: `${DIR}/04-desktop-status-tabs.png`, fullPage: false });
});

test("05 모바일 검수 대기 — 더보기", async ({ page }) => {
  await useManyScenario(page);
  await page.setViewportSize(MOBILE);
  await page.goto(PATH);
  const loadMore = page.getByRole("button", { name: "더보기" });
  await expect(loadMore).toBeVisible();
  await loadMore.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${DIR}/05-mobile-load-more.png`, fullPage: false });
});
