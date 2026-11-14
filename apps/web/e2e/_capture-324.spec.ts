import { test, expect, type Page } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#324). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-324";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

const PATH = "/customer/report/3f1c6a2e-9d84-4b17-8c55-2e7f0ab91d34";

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
  await hideQueryDevtools(page);
});

/** x-mock-metrics 픽스처로 진입하고 상세 본문이 뜰 때까지 기다린다. */
async function openReport(page: Page, fixture: string, viewport: { width: number; height: number }) {
  await page.setViewportSize(viewport);
  await page.setExtraHTTPHeaders({ "x-mock-metrics": fixture });
  await page.goto(PATH);
  await expect(page.getByText("장해등급 과소 산정 가능")).toBeVisible();
}

/** 예상 보상 카드(navy) — 신뢰도 문구·사유 박스가 들어 있는 곳. */
function payoutCard(page: Page) {
  return page.locator("section").filter({ hasText: "검토 가능한 예상 보상 범위" }).first();
}

/** 패널을 펼친다(하이드레이션 전 클릭 유실 대비 toPass, 재클릭으로 접히지 않게 상태 확인). */
async function expandPanel(page: Page) {
  const toggle = page.getByRole("button", { name: "AI 분석 근거" });
  await expect(async () => {
    if ((await toggle.getAttribute("aria-expanded")) !== "true") await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true", { timeout: 1000 });
  }).toPass({ timeout: 10000 });
  // 셰브런 회전(transition-transform)이 끝난 뒤 찍는다.
  await page.waitForTimeout(400);
  return page.getByRole("region", { name: "AI 분석 근거" });
}

test("01 PC 신뢰도 사유 — MEDIUM 사유 5개", async ({ page }) => {
  await openReport(page, "medium", DESKTOP);
  await expect(page.getByText("근거 미확인 주장 1건").filter({ visible: true })).toBeVisible();
  await payoutCard(page).screenshot({ path: `${DIR}/01-desktop-reasons-medium.png` });
});

test("02 PC 신뢰도 사유 — LOW 약관 공백(자료 보강 권유 제거)", async ({ page }) => {
  await openReport(page, "low-terms", DESKTOP);
  await expect(
    page.getByText("신뢰도 낮음 — 약관 근거가 부족해 변동 폭이 커요.").filter({ visible: true }),
  ).toBeVisible();
  await payoutCard(page).screenshot({ path: `${DIR}/02-desktop-reasons-low-terms.png` });
});

test("03 모바일 신뢰도 사유 — 예상 범위 아래 박스", async ({ page }) => {
  await openReport(page, "medium", MOBILE);
  await expect(page.getByText("근거 미확인 주장 1건").filter({ visible: true })).toBeVisible();
  await payoutCard(page).screenshot({ path: `${DIR}/03-mobile-reasons-medium.png` });
});

test("04 PC 근거 패널 — 펼침", async ({ page }) => {
  await openReport(page, "medium", DESKTOP);
  const panel = await expandPanel(page);
  await expect(panel.getByText("3건 중 2건 근거 확인")).toBeVisible();
  await panel.screenshot({ path: `${DIR}/04-desktop-panel-open.png` });
});

test("05 모바일 근거 패널 — 펼침", async ({ page }) => {
  await openReport(page, "medium", MOBILE);
  const panel = await expandPanel(page);
  await expect(panel.getByText("3건 중 2건 근거 확인")).toBeVisible();
  await panel.screenshot({ path: `${DIR}/05-mobile-panel-open.png` });
});

test("06 PC 상세 전체 — 패널 위치(근거 약관·판례 다음, 접힘)", async ({ page }) => {
  await openReport(page, "medium", DESKTOP);
  await expect(page.getByRole("button", { name: "AI 분석 근거" })).toBeVisible();
  await page.screenshot({ path: `${DIR}/06-desktop-full.png`, fullPage: true });
});

test("07 수치 없는 리포트(LEGACY_REPORT) 안내", async ({ page }) => {
  await openReport(page, "legacy", DESKTOP);
  const notice = page.getByRole("region", { name: "AI 분석 근거" });
  await expect(notice.getByText("이 리포트에는 분석 근거 수치가 없어요")).toBeVisible();
  await notice.screenshot({ path: `${DIR}/07-desktop-legacy.png` });
});

test("08 불러올 수 없음(UNAVAILABLE) 안내", async ({ page }) => {
  await openReport(page, "unavailable", DESKTOP);
  const notice = page.getByRole("region", { name: "AI 분석 근거" });
  await expect(notice.getByText("지금은 분석 근거를 불러올 수 없어요")).toBeVisible();
  await notice.screenshot({ path: `${DIR}/08-desktop-unavailable.png` });
});
