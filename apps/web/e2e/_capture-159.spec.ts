import { expect, test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#159). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-159";

const MOBILE = { width: 390, height: 900 };
const DESKTOP = { width: 1280, height: 900 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

test("01 새 콜백 라우트 에러 상태", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto("/login/oauth2/code/kakao?code=fail-external&state=s1");
  await page
    .getByText("소셜 로그인 연동 중 문제가 발생했어요. 잠시 후 다시 시도해 주세요.")
    .waitFor();
  await page.screenshot({ path: `${DIR}/01-callback-error-mobile.png`, fullPage: true });
});

test("02 새 콜백 라우트 로그인 완료 후 홈 도착", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/login/oauth2/code/kakao?code=valid&state=s1");
  await expect(page).toHaveURL(/\/customer\/dashboard/, { timeout: 15000 });
  await page
    .getByRole("heading", { name: "진행 중인 분석" })
    .filter({ visible: true })
    .first()
    .waitFor({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/02-callback-landing-desktop.png`, fullPage: true });
});
