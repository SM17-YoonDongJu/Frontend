import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#259). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-259";

const APP_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1 BareunApp/1.0";
const MOBILE = { width: 390, height: 844 };

test.use({ viewport: MOBILE });

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await setAuthCookie(page, "USER");
});

test.describe("앱 UA", () => {
  test.use({ userAgent: APP_UA });

  test("01 앱 하단 탭바 높이", async ({ page }) => {
    await page.goto("/customer/dashboard");
    // 지금 할 일 카드는 서스펜스 폴백(스켈레톤)을 거친다 — 본문이 뜬 뒤 찍는다.
    // 같은 문구가 데스크톱 트리에도 있어(md 분기) 보이는 요소만 고른다.
    await expect(
      page.getByText("새 제안 3건이 도착했어요").filter({ visible: true }),
    ).toBeVisible({ timeout: 15000 });
    await expect(page.getByRole("link", { name: "내정보", exact: true })).toBeVisible({
      timeout: 15000,
    });
    await page.screenshot({ path: `${DIR}/01-tabbar-app-mobile.png` });
  });

  test("02 받은 제안 화면 탭바 단일화", async ({ page }) => {
    await page.goto("/customer/proposals");
    await expect(page.getByRole("heading", { name: "받은 제안" })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByRole("link", { name: "내정보", exact: true })).toBeVisible();
    await page.screenshot({ path: `${DIR}/02-proposals-app-mobile.png` });
  });
});

test("03 웹 모바일 받은 제안 화면", async ({ page }) => {
  await page.goto("/customer/proposals");
  await expect(page.getByRole("heading", { name: "받은 제안" })).toBeVisible({ timeout: 15000 });
  await page.screenshot({ path: `${DIR}/03-proposals-web-mobile.png` });
});
