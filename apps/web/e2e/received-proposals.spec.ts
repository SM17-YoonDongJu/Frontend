import { expect, test } from "@playwright/test";

/**
 * 받은 제안 목록 E2E (happy-path, 이슈 #18).
 *
 * 원칙: 핵심 사용자 흐름만 — 목록 열람 / 거절(낙관적 제외) / 검수 의견 보기 이동 / 조회 톤다운.
 * 응답은 기본 MSW 핸들러가 제공(목록 3건, 거절 성공).
 * 빈 상태·거절 실패 롤백은 핸들러 오버라이드가 필요하므로 RTL+MSW 통합테스트로 분리(아래 백로그).
 */

const PATH = "/customer/proposals/test-id-123";

test("진입하면 받은 제안 목록과 분석 대상 정보가 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(
    page.getByRole("heading", { name: /제안 3건이 도착했어요/ }),
  ).toBeVisible();

  // 분석 대상(GET /reports/{id})
  await expect(page.getByText("질병")).toBeVisible();

  // 제안 카드(3건)
  await expect(page.getByText("김도현")).toBeVisible();
  await expect(page.getByText("정우성")).toBeVisible();
  await expect(page.getByText("이서연")).toBeVisible();
});

test("거절하면 해당 카드가 즉시 사라지고 건수가 줄어든다", async ({ page }) => {
  await page.goto(PATH);

  const firstCard = page.getByRole("listitem").filter({ hasText: "김도현" });
  await expect(firstCard).toBeVisible();

  await expect(async () => {
    await firstCard.getByRole("button", { name: "거절" }).click();
    await expect(page.getByText("김도현")).toHaveCount(0);
  }).toPass({ timeout: 10000 });

  // 낙관적 제외: 헤더 건수 3 → 2
  await expect(page.getByRole("heading", { name: /제안 2건이 도착했어요/ })).toBeVisible();
});

test("검수 의견 보기를 누르면 리포트 상세로 이동한다", async ({ page }) => {
  await page.goto(PATH);

  const firstCard = page.getByRole("listitem").filter({ hasText: "김도현" });
  await expect(firstCard).toBeVisible();

  await expect(async () => {
    await firstCard.getByRole("button", { name: "검수 의견 보기" }).click();
    await expect(page).toHaveURL(/\/customer\/report\/test-id-123/);
  }).toPass({ timeout: 10000 });
});
