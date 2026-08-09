import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#231). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-231";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

const REPORT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PATH = `/customer/proposals/${REPORT_ID}`;

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await setAuthCookie(page, "USER");
});

test("01 받은 제안 SENT 카드 상담 수락 버튼 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto(PATH);
  const sentCard = page.getByRole("listitem").filter({ hasText: "윤지후" });
  await expect(sentCard.getByRole("button", { name: "상담 수락" })).toBeEnabled({
    timeout: 15000,
  });
  await sentCard.scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${DIR}/01-sent-card-mobile.png`, fullPage: true });
});

test("02 상담 수락 후 채팅방 즉시 이동 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto(PATH);
  const sentCard = page.getByRole("listitem").filter({ hasText: "윤지후" });
  await expect(async () => {
    await sentCard.getByRole("button", { name: "상담 수락" }).click();
    await expect(page).toHaveURL(/\/customer\/chat\/e1000000-0000-4000-8000-000000000003/);
  }).toPass({ timeout: 15000 });
  await page.getByRole("textbox", { name: "메시지 입력" }).waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/02-chat-room-mobile.png`, fullPage: true });
});

test("03 받은 제안 목록 데스크톱", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(PATH);
  const sentCard = page.getByRole("listitem").filter({ hasText: "윤지후" });
  await expect(sentCard.getByRole("button", { name: "상담 수락" })).toBeEnabled({
    timeout: 15000,
  });
  await page.screenshot({ path: `${DIR}/03-proposals-desktop.png`, fullPage: true });
});
