import { test, expect } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools, selectRegion } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#267). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-267";

const DESKTOP = { width: 1280, height: 900 };

const PATH = "/signup?socialToken=e2e-social-token";

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
  await setAuthCookie(page, "USER");
});

test("01 완료 화면 — 이메일 행 없음", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(PATH);
  const card = page.getByRole("radio", { name: /일반 사용자/ });
  await expect(async () => {
    await card.click();
    await expect(card).toHaveAttribute("aria-checked", "true");
  }).toPass({ timeout: 10000 });
  await page.getByRole("button", { name: "시작하기" }).click();
  await page.getByRole("button", { name: "전체 동의" }).click();
  await page.getByRole("button", { name: "다음" }).click();
  await expect(page.getByRole("heading", { name: "본인 확인을 해주세요" })).toBeVisible();

  await page.getByLabel("이름").fill("윤서");
  await page.getByRole("radio", { name: "여성" }).click();
  await page.getByLabel("생년월일").fill("19950615");
  await page.getByLabel("휴대폰 번호").fill("01012345678");
  await selectRegion(page, "서울특별시", "강남구", /거주 지역/);

  await page.getByRole("button", { name: "다음" }).click();
  await expect(page.getByRole("heading", { name: "가입이 완료됐어요" })).toBeVisible();
  await page.screenshot({ path: `${DIR}/01-complete-desktop.png` });
});
