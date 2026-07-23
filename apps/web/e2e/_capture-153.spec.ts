import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#153). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-153";
const PROPOSAL_5_REPORT_ID = "c3d0e1f2-4a5b-4c6d-9e7f-8a9b0c1d2e3f";
const RECEIVED_ONLY_REPORT_ID = "a1000000-0000-4000-8000-000000000002";

const MOBILE = { width: 390, height: 900 };
const DESKTOP = { width: 1280, height: 900 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

test("01 데스크톱 리포트 목록 제안 N건 보기", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/customer/reports");
  await page.getByRole("link", { name: "제안 5건 보기" }).waitFor();
  await page.screenshot({ path: `${DIR}/01-report-list-desktop.png`, fullPage: true });
});

test("02 데스크톱 제안 5건 목록", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(`/customer/proposals/${PROPOSAL_5_REPORT_ID}`);
  await page.getByText("박지훈").waitFor();
  await page.screenshot({ path: `${DIR}/02-proposals-5-desktop.png`, fullPage: true });
});

test("03 모바일 받은 제안 목록", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/customer/proposals");
  await page.getByText("실손 · 도수치료 한도").waitFor();
  await page.screenshot({ path: `${DIR}/03-received-list-mobile.png`, fullPage: true });
});

test("04 모바일 받은 제안 전용 리포트 2건", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto(`/customer/proposals/${RECEIVED_ONLY_REPORT_ID}`);
  await page.getByText("박준호").waitFor();
  await page.screenshot({ path: `${DIR}/04-proposals-2-mobile.png`, fullPage: true });
});
