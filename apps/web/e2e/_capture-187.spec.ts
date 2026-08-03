import { test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#187 채팅 공유 리포트). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-187";
const ROOM_1 = "e1000000-0000-4000-8000-000000000001";

const DESKTOP = { width: 1280, height: 900 };
const MOBILE = { width: 390, height: 844 };

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
  await hideQueryDevtools(page);
});

test("01 채팅방 리포트 보기 버튼(데스크톱)", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(`/customer/chat/${ROOM_1}`);
  await page.getByRole("link", { name: "리포트 보기" }).waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/01-chat-report-button-desktop.png` });
});

test("02 공유 리포트 화면(데스크톱)", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(`/customer/chat/${ROOM_1}/shared-report`);
  await page.getByText("김도현 손해사정사").waitFor({ timeout: 15000 });
  await page.getByRole("heading", { name: "근거 약관·판례" }).waitFor();
  await page.screenshot({ path: `${DIR}/02-shared-report-desktop.png`, fullPage: true });
});

test("03 공유 리포트 화면(모바일)", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto(`/customer/chat/${ROOM_1}/shared-report`);
  await page.getByText("김도현 손해사정사").waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/03-shared-report-mobile.png`, fullPage: true });
});

test("04 접근 권한 없음 안내", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-failure": "shared-report-forbidden" });
  await page.setViewportSize(DESKTOP);
  await page.goto(`/customer/chat/${ROOM_1}/shared-report`);
  await page.getByText("접근 권한이 없어요").waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/04-forbidden-desktop.png` });
});
