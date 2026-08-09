import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * #216: 검수 대기 필터 전환 시 서스펜스 깜빡임 회귀 방지 E2E.
 *
 * PC 레이아웃 전용 — 모바일은 DesktopReviewBoundary 대상이 아님(ReviewBoundary 별도 경계).
 */

const LIST_PATH = "/partner/review";

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "CERTIFICATED_ADJUSTER");
});

test("상태 탭 전환 중에도 통계 카드·기존 목록이 유지되다가 새 데이터로 교체된다", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "PC 전용 DesktopReviewBoundary 대상 회귀 테스트");

  await page.goto(LIST_PATH);

  const summaryCard = page.getByText("검수 대기").first();
  await expect(summaryCard).toBeVisible();

  const initialCard = page.getByRole("listitem").filter({ hasText: /우측 슬관절 인대 파열/ });
  await expect(initialCard).toBeVisible();

  const statusTabs = page.getByRole("tablist", { name: "상태 필터" });
  const nextTab = statusTabs.getByRole("tab", { name: "전송 완료" });
  await nextTab.click();

  // 전환 중(pending): 통계 카드는 그대로, 기존 목록도 즉시 사라지지 않아야 한다.
  await expect(summaryCard).toBeVisible();
  await expect(initialCard).toBeVisible();
  await expect(statusTabs).toHaveAttribute("aria-busy", "true");

  // 전환 완료: 새 필터의 목록으로 교체.
  await expect(page.getByRole("listitem").filter({ hasText: /경추 염좌/ })).toBeVisible();
  await expect(initialCard).toHaveCount(0);
  await expect(statusTabs).not.toHaveAttribute("aria-busy", "true");
  await expect(summaryCard).toBeVisible();
});
