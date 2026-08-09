import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * 고객 홈 대시보드 개편 E2E — 모바일 (이슈 #142).
 *
 * 원칙: <md 모바일 홈 트리의 핵심 흐름 — 인사·지금 할 일·제안 비교·빠른 실행 렌더와 진입 이동,
 *   온보딩(리포트 0건) 렌더. 데스크톱 트리가 DOM에 hidden 공존하므로 visible 노드만 단언.
 * 상태 주입은 MSW x-mock-scenario 헤더(page.route 무효 — MSW 워커 가로챔). 기본=제안 도착.
 * 데스크톱 4상태 섹션 숨김 회귀는 dashboard.spec.ts.
 */

const PATH = "/customer/dashboard";

test.use({ viewport: { width: 390, height: 900 } });

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
});

test("진입하면 인사·지금 할 일·제안 비교·빠른 실행이 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(
    page.getByRole("heading", { name: "안녕하세요, 윤서님" }).filter({ visible: true }),
  ).toBeVisible();
  await expect(page.getByText("지금 할 일").filter({ visible: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "받은 제안 비교" }).filter({ visible: true }),
  ).toBeVisible();

  // 빠른 실행 3개 중 대표 링크
  await expect(
    page.getByRole("link", { name: "새 분석", exact: true }).filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "사정사 찾기" }).filter({ visible: true }),
  ).toBeVisible();
});

test("제안 비교하기를 누르면 내 리포트 목록으로 이동한다", async ({ page }) => {
  await page.goto(PATH);

  await expect(async () => {
    await page
      .getByRole("link", { name: "제안 3건 비교하기" })
      .filter({ visible: true })
      .click();
    await expect(page).toHaveURL(/\/customer\/reports$/);
  }).toPass({ timeout: 10000 });
});

test("온보딩: 리포트 0건이면 히어로와 사정사 소개가 보이고 첫 분석 시작이 이동한다", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "dashboard-onboarding" });
  await page.goto(PATH);

  await expect(
    page.getByText("첫 방문을 환영해요, 윤서님").filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /제대로 받고 계신가요/ }).filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "어떤 사정사가 함께하나요?" }).filter({ visible: true }),
  ).toBeVisible();

  await expect(async () => {
    await page.getByRole("link", { name: "5분 만에 첫 분석 시작" }).filter({ visible: true }).click();
    await expect(page).toHaveURL(/\/customer\/adjust-request/);
  }).toPass({ timeout: 10000 });
});
