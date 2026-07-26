import { test } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#184). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-184";

const DESKTOP = { width: 1280, height: 900 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

test("01 데스크톱 신청 폼 전문분야 칩", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/signup/verification");
  await page.getByRole("heading", { name: "자격 정보를 인증해주세요" }).waitFor();
  await page.getByText("전문 분야", { exact: false }).first().scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${DIR}/01-verification-desktop-specialties.png` });
});

test("02 전문분야 미선택 인라인 에러", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto("/signup/verification");
  await page.getByRole("heading", { name: "자격 정보를 인증해주세요" }).waitFor();
  await page.getByRole("button", { name: "인증 신청하기" }).click();
  await page.getByText("전문분야를 1개 이상 선택해 주세요.").waitFor();
  await page.getByText("전문분야를 1개 이상 선택해 주세요.").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${DIR}/02-verification-specialties-error.png` });
});

test("03 반려 화면 제출 서류 리스트", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "application-rejected" });
  await page.goto("/signup/verification/status");
  await page.getByRole("heading", { name: "서류를 다시 확인해주세요" }).waitFor();
  await page.screenshot({ path: `${DIR}/03-rejected-documents.png`, fullPage: true });
});
