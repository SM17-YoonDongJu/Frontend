import { expect, test } from "@playwright/test";

/**
 * 고객 대시보드 E2E (happy-path, 이슈 #28).
 *
 * 원칙: 핵심 사용자 흐름만 — 진입 시 인사말·진행현황·리포트·검수완료·받은제안 렌더 확인,
 * "새 분석 시작" → /customer/adjust-request 이동.
 * 응답은 기본 MSW 핸들러가 제공(GET /users/me 윤서, GET /reports 2건: MATCHED+AWAITING).
 * 영역 에러격리·빈상태·로딩 등 엣지는 RTL+MSW 통합테스트로 분리.
 */

const PATH = "/customer/dashboard";

test("진입하면 인사말·진행현황·리포트·검수완료·받은제안이 보인다", async ({
  page,
}) => {
  await page.goto(PATH);

  // 배너 인사말(GET /users/me → nickname 윤서)
  const banner = page.locator("section").filter({ hasText: "님, 안녕하세요" });
  await expect(banner.getByText("윤서 님, 안녕하세요")).toBeVisible();

  // 진행 현황 통계 — 진행 중 1건(AWAITING_INSPECTION) / 받은 제안 합계 2
  await expect(banner.getByText("진행 중").locator("..")).toContainText("1");
  await expect(banner.getByText("받은 제안").locator("..")).toContainText("2");

  await expect(page.getByRole("heading", { name: "내 분석 리포트" })).toBeVisible();

  // 내 리포트 카드(reportNo) — AWAITING 리포트는 이 섹션에만 노출
  await expect(page.getByText("No.20260512-009")).toBeVisible();
  // MATCHED reportNo는 리포트+검수완료 양쪽에 노출 → 최소 1개
  await expect(page.getByText(/No\.20260520-017/).first()).toBeVisible();

  // 검수 완료 알림(MATCHED 1건, adjusterNickname 김도현)
  await expect(
    page.getByRole("heading", { name: "검수 완료 알림" }),
  ).toBeVisible();
  await expect(page.getByText("김도현 손해사정사")).toBeVisible();

  // 받은 제안(proposalCount>0 리포트 → proposals 응답 2건 미리보기)
  await expect(page.getByRole("heading", { name: "받은 제안" })).toBeVisible();
});

test("새 분석 시작을 누르면 분석 신청 페이지로 이동한다", async ({ page }) => {
  await page.goto(PATH);

  await page
    .getByRole("link", { name: /새 분석 시작/ })
    .first()
    .click();
  await expect(page).toHaveURL(/\/customer\/adjust-request/, { timeout: 10000 });
});
