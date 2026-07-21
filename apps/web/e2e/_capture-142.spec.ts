import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#142). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-142";
const PATH = "/customer/dashboard";

const MOBILE = { width: 390, height: 900 };
const DESKTOP = { width: 1280, height: 900 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

// 모든 suspense 섹션(추천 사정사·내 리포트는 각자 지연 로드)이 채워진 뒤 캡처하도록
// 마지막 섹션까지 대기 — 스켈레톤 상태가 찍히는 것 방지.
test("01 기존 유저 데스크톱", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(PATH);
  await page.getByText("지금 할 일").filter({ visible: true }).first().waitFor();
  await page.getByRole("heading", { name: "이런 사정사는 어때요?" }).filter({ visible: true }).waitFor();
  await page.getByRole("heading", { name: "내 분석 리포트" }).filter({ visible: true }).waitFor();
  await page.screenshot({ path: `${DIR}/01-dashboard-desktop.png`, fullPage: true });
});

test("02 기존 유저 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto(PATH);
  await page.getByText("지금 할 일").filter({ visible: true }).first().waitFor();
  await page.getByRole("heading", { name: "이런 사정사는 어때요?" }).filter({ visible: true }).waitFor();
  await page.screenshot({ path: `${DIR}/02-dashboard-mobile.png`, fullPage: true });
});

test("03 온보딩 데스크톱", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "dashboard-onboarding" });
  await page.setViewportSize(DESKTOP);
  await page.goto(PATH);
  await page.getByText("첫 방문을 환영해요, 윤서님").waitFor();
  await page.getByRole("heading", { name: "어떤 사정사가 함께하나요?" }).waitFor();
  await page.screenshot({ path: `${DIR}/03-onboarding-desktop.png`, fullPage: true });
});

test("04 온보딩 모바일", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "dashboard-onboarding" });
  await page.setViewportSize(MOBILE);
  await page.goto(PATH);
  await page.getByText("첫 방문을 환영해요, 윤서님").waitFor();
  await page.getByRole("heading", { name: "어떤 사정사가 함께하나요?" }).waitFor();
  await page.screenshot({ path: `${DIR}/04-onboarding-mobile.png`, fullPage: true });
});
