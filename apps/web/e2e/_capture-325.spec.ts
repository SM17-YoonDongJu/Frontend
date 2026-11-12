import { test, expect } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#325). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-325";

const DESKTOP = { width: 1280, height: 900 };

const REPORT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PATH = `/customer/proposals/${REPORT_ID}`;

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
  await hideQueryDevtools(page);
  await page.setViewportSize(DESKTOP);
});

test("01 받은 제안 — 수락 전 제안 도착 카드와 상담 중 카드", async ({ page }) => {
  await page.goto(PATH);
  const sentCard = page.getByRole("listitem").filter({ hasText: "윤지후" });
  await expect(sentCard.getByRole("button", { name: "상담 수락" })).toBeVisible();
  await page.screenshot({ path: `${DIR}/01-proposals-before-accept.png`, fullPage: true });
});

test("02 상담 수락 — 열린 채팅방으로 이동", async ({ page }) => {
  await page.goto(PATH);
  const sentCard = page.getByRole("listitem").filter({ hasText: "윤지후" });
  await expect(async () => {
    await sentCard.getByRole("button", { name: "상담 수락" }).click();
    await expect(page).toHaveURL(/\/customer\/chat\/[0-9a-f-]+/);
  }).toPass({ timeout: 15000 });
  await expect(page.getByText("윤지후 손해사정사").first()).toBeVisible();
  // 스레드 목 응답(지연 400ms)이 끝난 뒤 찍는다 — 스켈레톤이 잡히지 않게.
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `${DIR}/02-chat-opened-after-accept.png`, fullPage: true });
});

test("03 매칭 완료 — 확인 모달(채택 API)", async ({ page }) => {
  await page.goto(PATH);
  const card = page.getByRole("listitem").filter({ hasText: "김도현" });
  await expect(card.getByRole("button", { name: "매칭 완료" })).toBeEnabled();
  await card.getByRole("button", { name: "매칭 완료" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.screenshot({ path: `${DIR}/03-match-confirm-modal.png`, fullPage: true });
});

test("04 매칭 완료 후 — 매칭한 제안만 남는다", async ({ page }) => {
  await page.goto(PATH);
  const card = page.getByRole("listitem").filter({ hasText: "김도현" });
  await expect(card.getByRole("button", { name: "매칭 완료" })).toBeEnabled();
  await card.getByRole("button", { name: "매칭 완료" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "매칭 완료" }).click();
  await expect(page.getByText("정우성")).toHaveCount(0);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${DIR}/04-matched-only.png`, fullPage: true });
});
