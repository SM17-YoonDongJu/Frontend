import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#212). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-212";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

test("01 대시보드 사정사 추천·비교·온보딩 카드", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/customer/dashboard");
  await page.getByText("이런 사정사는 어때요?").first().waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/01-dashboard-desktop.png`, fullPage: true });
});

test("02 받은 제안 카드", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/customer/proposals");
  const proposalListLink = page.getByRole("link").filter({ hasText: /제안/ }).first();
  await proposalListLink.waitFor({ timeout: 15000 });
  await proposalListLink.click();
  await page.getByText("상세 보기").first().waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/02-proposal-card-desktop.png` });
});

test("03 리포트 상세 검수자 카드", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/customer/report/b0000000-0000-4000-8000-000000000021");
  await page.getByText("검수 의견").first().waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/03-report-detail-desktop.png` });
});

test("04 사정사 찾기 모바일 프로필 링크", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/customer/adjusters");
  await page.getByRole("link").first().waitFor();
  await page.screenshot({ path: `${DIR}/04-adjusters-mobile.png` });
});
