import { expect, test, type Page } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#179). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-179";

const MOBILE = { width: 390, height: 844 };
const DESKTOP = { width: 1280, height: 900 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

// 하이드레이션 가드 — 첫 클릭 유실 시 재시도
async function openConfirmDialog(page: Page) {
  await expect(async () => {
    await page.getByRole("button", { name: "회원 탈퇴" }).click();
    await expect(page.getByRole("dialog", { name: "정말 탈퇴하시겠어요?" })).toBeVisible({
      timeout: 5000,
    });
  }).toPass({ timeout: 20000 });
}

test("01 탈퇴 안내 PC", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/withdraw");
  await page.getByRole("heading", { level: 1, name: "회원 탈퇴" }).waitFor();
  await page.screenshot({ path: `${DIR}/01-withdraw-pc.png` });
});

test("02 최종 확인 다이얼로그 PC", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/withdraw");
  await openConfirmDialog(page);
  await page.screenshot({ path: `${DIR}/02-confirm-dialog-pc.png` });
});

test("03 탈퇴 안내 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/withdraw");
  await page.getByRole("heading", { level: 1, name: "회원 탈퇴" }).waitFor();
  await page.screenshot({ path: `${DIR}/03-withdraw-mobile.png` });
});

test("04 실패 안내·재시도 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.setExtraHTTPHeaders({ "x-mock-failure": "withdraw" });
  await page.goto("/withdraw");
  await openConfirmDialog(page);
  await page.getByRole("button", { name: "탈퇴하기" }).click();
  await page.getByText("회원 탈퇴를 처리하지 못했어요").waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/04-withdraw-error-mobile.png` });
});

test("05 고객 PC 사이드바 진입점", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/customer/mypage");
  await page.getByRole("heading", { name: "윤서 님" }).waitFor();
  await page
    .getByRole("link", { name: "회원 탈퇴" })
    .filter({ visible: true })
    .scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${DIR}/05-customer-sidebar-entry.png` });
});

test("06 사정사 마이페이지 진입점 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/partner/mypage");
  await page.getByRole("heading", { level: 1, name: "내 정보" }).waitFor();
  await page
    .getByRole("link", { name: "회원 탈퇴" })
    .filter({ visible: true })
    .scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${DIR}/06-partner-mypage-entry.png` });
});
