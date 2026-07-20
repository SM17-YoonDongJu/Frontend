import { expect, test } from "@playwright/test";

/**
 * 받은 제안 목록 E2E (happy-path, 이슈 #18/#123).
 *
 * 원칙: 핵심 사용자 흐름만 — 목록 열람 / 상담 수락(형제 제안 자동 종료) / 상세 보기 이동.
 * 응답은 기본 MSW 핸들러가 제공 — 제안은 채팅 시드와 동일 원천(같은 사건 3건: 김도현·정우성·윤지후).
 * 거절 진입은 채팅 화면으로 일원화(#123) — 거절 흐름은 chat.spec.ts가 검증한다.
 * 빈 상태·수락 실패는 핸들러 오버라이드가 필요해 의식적으로 테스트하지 않는다(정적 레이어가 하위 대체).
 */

// 채팅·제안 공용 시드 사건(reportId) — handlers.ts DASHBOARD_PROPOSABLE_REPORT_ID
const REPORT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PATH = `/customer/proposals/${REPORT_ID}`;

test("진입하면 받은 제안 목록과 분석 대상 정보가 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(page.getByRole("heading", { name: "받은 제안" })).toBeVisible();

  // 분석 대상(proposals 응답 target)
  await expect(page.getByText("No.20260520-017")).toBeVisible();

  // 제안 카드(3건)
  await expect(page.getByText("김도현")).toBeVisible();
  await expect(page.getByText("정우성")).toBeVisible();
  await expect(page.getByText("윤지후")).toBeVisible();
});

test("상담을 수락하면 수락한 제안만 남는다", async ({ page }) => {
  await page.goto(PATH);

  const firstCard = page.getByRole("listitem").filter({ hasText: "김도현" });
  await expect(firstCard).toBeVisible();

  await firstCard.getByRole("button", { name: "상담 수락" }).click();

  // 확인 모달을 거쳐야 채택된다(#122)
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "매칭 완료" }).click();

  // 수락 시 같은 사건의 다른 제안은 자동 종료 → 목록에서 제외
  await expect(page.getByText("정우성")).toHaveCount(0);
  await expect(page.getByText("윤지후")).toHaveCount(0);
  await expect(firstCard).toBeVisible();
});

test("상세 보기를 누르면 리포트 상세로 이동한다", async ({ page }) => {
  await page.goto(PATH);

  const firstCard = page.getByRole("listitem").filter({ hasText: "김도현" });
  await expect(firstCard).toBeVisible();

  await expect(async () => {
    await firstCard.getByRole("button", { name: "상세 보기" }).click();
    await expect(page).toHaveURL(new RegExp(`/customer/report/${REPORT_ID}`));
  }).toPass({ timeout: 10000 });
});
