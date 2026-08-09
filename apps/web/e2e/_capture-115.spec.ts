import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#115). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-115";

test.use({ viewport: { width: 1280, height: 900 } });

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

test("01 가입 자격 인증 활동 지역", async ({ page }) => {
  await page.goto("/signup/verification");
  await page.getByRole("radio", { name: "독립 (개업)" }).click();
  await page.getByRole("button", { name: "지역", exact: true }).click();
  await page.getByRole("dialog", { name: "지역 선택" }).getByRole("button", { name: "서울특별시" }).click();
  await page.screenshot({ path: `${DIR}/01-verification-region.png` });
});

test("02 프로필 편집 활동 지역", async ({ page }) => {
  await page.goto("/partner/profile/edit");
  const trigger = page.getByRole("button", { name: /서울 전체 외 1곳/ });
  await trigger.waitFor();
  await trigger.click();
  await page.screenshot({ path: `${DIR}/02-profile-edit-region.png` });
});

test("03 마이페이지 지역(PC 모달 안 시트)", async ({ page }) => {
  await page.goto("/customer/mypage");
  await page.getByRole("button", { name: "프로필 수정" }).click();
  await page.getByRole("button", { name: /서울 강남구/ }).click();
  await page.screenshot({ path: `${DIR}/03-mypage-region.png` });
});

test("04 마이페이지 지역(모바일 바텀시트 안 시트)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/customer/mypage");
  await page.getByRole("button", { name: "수정" }).first().click();
  await page.getByRole("button", { name: /서울 강남구/ }).click();
  await page.screenshot({ path: `${DIR}/04-mypage-region-mobile.png` });
});
