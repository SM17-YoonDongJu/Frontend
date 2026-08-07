import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#261). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-261";

const MOBILE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 900 };

const AWAITING_REPORT = "/customer/report/3f1c6a2e-9d84-4b17-8c55-2e7f0ab91d34";
const REVIEWED_REPORT = "/customer/report/test-id-123";

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await setAuthCookie(page, "USER");
});

test.describe("모바일", () => {
  test.use({ viewport: MOBILE });

  test("01 검수 대기 리포트 안내", async ({ page }) => {
    await page.goto(AWAITING_REPORT);
    await expect(page.getByRole("heading", { name: "아직 검수 대기 중이에요" })).toBeVisible({
      timeout: 15000,
    });
    await page.screenshot({ path: `${DIR}/01-report-awaiting-mobile.png` });
  });

  test("02 검수 완료 리포트 회귀", async ({ page }) => {
    await page.goto(REVIEWED_REPORT);
    await expect(page.getByRole("heading", { name: /검수해주셨어요/ })).toBeVisible({
      timeout: 15000,
    });
    await page.screenshot({ path: `${DIR}/02-report-reviewed-mobile.png` });
  });

  test("03 제안 목록 빈 상태", async ({ page }) => {
    await page.goto("/customer/proposals/3f1c6a2e-9d84-4b17-8c55-2e7f0ab91d34");
    await expect(page.getByText("아직 도착한 제안이 없어요")).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: `${DIR}/03-proposals-empty-mobile.png` });
  });
});

test.describe("데스크톱", () => {
  test.use({ viewport: DESKTOP });

  test("04 검수 대기 리포트 안내", async ({ page }) => {
    await page.goto(AWAITING_REPORT);
    await expect(page.getByRole("heading", { name: "아직 검수 대기 중이에요" })).toBeVisible({
      timeout: 15000,
    });
    await page.screenshot({ path: `${DIR}/04-report-awaiting-desktop.png` });
  });

  test("05 대시보드 리포트 카드", async ({ page }) => {
    await page.goto("/customer/dashboard");
    await expect(
      page.getByRole("heading", { name: "내 분석 리포트" }).filter({ visible: true }),
    ).toBeVisible({ timeout: 15000 });
    await page.screenshot({ path: `${DIR}/05-dashboard-report-cards.png` });
  });
});
