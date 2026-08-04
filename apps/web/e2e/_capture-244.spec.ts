import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#244). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-244";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

const ROOM_1 = "e1000000-0000-4000-8000-000000000001";
const CUSTOMER_ROOM = `/customer/chat/${ROOM_1}`;

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await setAuthCookie(page, "USER");
});

test("01 데스크톱 헤더 신고 버튼", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(CUSTOMER_ROOM);
  await expect(page.getByRole("button", { name: "신고", exact: true })).toBeVisible();
  await page.screenshot({ path: `${DIR}/244-01-header-desktop.png` });
});

test("02 신고 다이얼로그 사유 선택", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(CUSTOMER_ROOM);

  const dialog = page.getByRole("dialog", { name: "이 대화를 신고할까요?" });
  await expect(async () => {
    await page.getByRole("button", { name: "신고", exact: true }).click();
    await expect(dialog).toBeVisible();
  }).toPass({ timeout: 10000 });

  await dialog.getByText("욕설·비방·괴롭힘", { exact: true }).click();
  await expect(dialog.getByRole("radio", { name: "욕설·비방·괴롭힘" })).toBeChecked();
  await page.screenshot({ path: `${DIR}/244-02-dialog-reason.png` });
});

test("03 기타 사유 상세 입력", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(CUSTOMER_ROOM);

  const dialog = page.getByRole("dialog", { name: "이 대화를 신고할까요?" });
  await expect(async () => {
    await page.getByRole("button", { name: "신고", exact: true }).click();
    await expect(dialog).toBeVisible();
  }).toPass({ timeout: 10000 });

  await dialog.getByText("기타", { exact: true }).click();
  await dialog.getByLabel(/상세 사유/).fill("상담 중 반복적인 욕설이 있었습니다.");
  await page.screenshot({ path: `${DIR}/244-03-dialog-other.png` });
});

test("04 모바일 헤더 아이콘 버튼", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto(CUSTOMER_ROOM);
  await expect(page.getByRole("button", { name: "신고하기" }).first()).toBeVisible();
  await page.screenshot({ path: `${DIR}/244-04-header-mobile.png`, fullPage: true });
});
