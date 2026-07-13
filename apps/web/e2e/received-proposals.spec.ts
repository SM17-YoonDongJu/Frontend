import { expect, test } from "@playwright/test";

/**
 * 받은 제안 목록 E2E (happy-path, 이슈 #18).
 *
 * 원칙: 핵심 사용자 흐름만 — 목록 열람 / 거절(통합 매칭 PATCH로 제외) / 검수 의견 보기 이동.
 * 응답은 기본 MSW 핸들러가 제공 — 제안은 채팅 시드와 동일 원천(같은 사건 3건: 김도현·정우성·윤지후).
 * 빈 상태·거절 실패 롤백은 핸들러 오버라이드가 필요하므로 RTL+MSW 통합테스트로 분리(아래 백로그).
 */

// 채팅·제안 공용 시드 사건(reportId) — handlers.ts DASHBOARD_PROPOSABLE_REPORT_ID
const REPORT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PATH = `/customer/proposals/${REPORT_ID}`;

test("진입하면 받은 제안 목록과 분석 대상 정보가 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(
    page.getByRole("heading", { name: /제안 3건이 도착했어요/ }),
  ).toBeVisible();

  // 분석 대상(proposals 응답 target)
  await expect(page.getByText("No.20260520-017")).toBeVisible();

  // 제안 카드(3건)
  await expect(page.getByText("김도현")).toBeVisible();
  await expect(page.getByText("정우성")).toBeVisible();
  await expect(page.getByText("윤지후")).toBeVisible();
});

test("거절하면 해당 제안이 목록에서 제외된다", async ({ page }) => {
  await page.goto(PATH);

  const firstCard = page.getByRole("listitem").filter({ hasText: "김도현" });
  await expect(firstCard).toBeVisible();

  await firstCard.getByRole("button", { name: "거절" }).click();

  // 거절 성공 시 목록 갱신 → 해당 카드 제거
  await expect(firstCard).toHaveCount(0);
  await expect(page.getByText("정우성")).toBeVisible();
});

test("검수 의견 보기를 누르면 리포트 상세로 이동한다", async ({ page }) => {
  await page.goto(PATH);

  const firstCard = page.getByRole("listitem").filter({ hasText: "김도현" });
  await expect(firstCard).toBeVisible();

  await expect(async () => {
    await firstCard.getByRole("button", { name: "검수 의견 보기" }).click();
    await expect(page).toHaveURL(new RegExp(`/customer/report/${REPORT_ID}`));
  }).toPass({ timeout: 10000 });
});
