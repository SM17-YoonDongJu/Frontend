import { expect, test } from "@playwright/test";

/**
 * 받은 제안 목록(요청건별) E2E (happy-path, 이슈 #78/#154).
 *
 * 원칙: 핵심 사용자 흐름만 — 목록 열람 / 카드 선택 시 리포트별 제안 목록 이동 / 뷰포트별 내비 노출.
 * 응답은 기본 MSW 핸들러가 제공(GET /me/received-proposals 시드 4건, hasNext false).
 * PC(#154)는 하단 탭바 대신 레이아웃 헤더를 쓴다 — 뷰포트별 탭바 노출을 양방향으로 가드.
 * 빈 상태는 핸들러 오버라이드가 필요해 의식적으로 테스트하지 않는다(정적 레이어가 하위 대체).
 * 더보기(페이지네이션)는 시드가 단일 페이지라 미테스트 — 형식은 zod·TS에 위임.
 */

const PATH = "/customer/proposals";
// 기본 MSW 시드 첫 카드(제안 도착)의 reportId — handlers.ts DASHBOARD_PROPOSABLE_REPORT_ID(#157 정합)
const ARRIVED_REPORT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

test("진입하면 요청건별 받은 제안 카드가 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(page.getByRole("heading", { name: "받은 제안" })).toBeVisible();

  // 상태별 시드 카드(제안 도착 / 종결 2건 / 검수 대기 중)
  await expect(page.getByText("교통사고 · 후유장해")).toBeVisible();
  await expect(page.getByText("실손 · 도수치료 한도")).toBeVisible();
  await expect(page.getByText("질병 · 암진단비")).toBeVisible();
  await expect(page.getByText("상해 · 외모추상 특약")).toBeVisible();

  // 제안 도착 카드의 요약 문구
  await expect(page.getByText("김도현 외 2명이 제안을 보냈어요")).toBeVisible();
});

test("카드를 누르면 해당 리포트의 제안 목록으로 이동한다", async ({ page }) => {
  await page.goto(PATH);

  const arrivedCard = page.getByRole("listitem").filter({ hasText: "교통사고 · 후유장해" });
  await expect(arrivedCard).toBeVisible();

  await expect(async () => {
    await arrivedCard.getByRole("link").click();
    await expect(page).toHaveURL(new RegExp(`/customer/proposals/${ARRIVED_REPORT_ID}`));
  }).toPass({ timeout: 10000 });
});

test("PC에서는 하단 탭바가 보이지 않는다", async ({ page, isMobile }) => {
  test.skip(isMobile, "PC 전용 — 모바일은 아래 테스트가 가드");

  await page.goto(PATH);
  await expect(page.getByRole("heading", { name: "받은 제안" })).toBeVisible();

  // 하단 탭바의 "내정보"(붙임) — 헤더의 "내 정보"(띄어쓰기)와 구분된다
  await expect(page.getByRole("link", { name: "내정보", exact: true })).toBeHidden();
});

test("모바일에서는 하단 탭바가 보인다", async ({ page, isMobile }) => {
  test.skip(!isMobile, "모바일 전용 — PC는 위 테스트가 가드");

  await page.goto(PATH);
  await expect(page.getByRole("heading", { name: "받은 제안" })).toBeVisible();

  await expect(page.getByRole("link", { name: "내정보", exact: true })).toBeVisible();
});
