import { expect, test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#161). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-161";

const DESKTOP = { width: 1280, height: 900 };

const ROOM_1 = "e1000000-0000-4000-8000-000000000001";

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

test("01 채팅 목록 그룹(스키마 정합 후 무회귀)", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/customer/chat");
  await page.getByText("상담 중 · 비교", { exact: true }).waitFor();
  await page.screenshot({ path: `${DIR}/01-chat-list-desktop.png`, fullPage: true });
});

test("02 딥링크 직진입(목록 응답 없이 스레드 렌더)", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.setExtraHTTPHeaders({ "x-mock-empty": "chat-list" });
  await page.goto(`/customer/chat/${ROOM_1}`);
  await expect(
    page.getByText("안녕하세요, 김도현 손해사정사입니다. 리포트 잘 받았습니다."),
  ).toBeVisible();
  await page.screenshot({ path: `${DIR}/02-deeplink-thread-desktop.png`, fullPage: true });
});
