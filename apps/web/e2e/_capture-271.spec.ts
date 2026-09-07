import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";
import {
  ADJUST_REQUEST_PATH as PATH,
  attachDocument,
  attachRequiredDocuments,
  fillToDocumentStep,
} from "./_adjust-request-helpers";

/** PR 스크린샷 캡처 헬퍼(#271). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-271";

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
  await hideQueryDevtools(page);
});

test.describe("데스크톱", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("01 필수 서류 미첨부 차단", async ({ page }) => {
    await page.goto(PATH);
    await fillToDocumentStep(page);
    await page.getByRole("button", { name: /다음/ }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "진단서·보험증권 첨부 후 진행할 수 있어요." }),
    ).toBeVisible();
    await page.screenshot({ path: `${DIR}/01-required-blocked-desktop.png` });
  });

  test("02 업로드 중 진행 차단", async ({ page }) => {
    await page.route("**/uploads", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await route.continue();
    });
    await page.goto(PATH);
    await fillToDocumentStep(page);
    await attachDocument(page, "진단서");
    await page.getByRole("button", { name: /다음/ }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "서류 업로드가 끝난 뒤에 진행할 수 있어요." }),
    ).toBeVisible();
    await page.screenshot({ path: `${DIR}/02-uploading-blocked-desktop.png` });
  });

  test("03 업로드 완료 후 확인 단계", async ({ page }) => {
    await page.goto(PATH);
    await fillToDocumentStep(page);
    await attachRequiredDocuments(page);
    await page.screenshot({ path: `${DIR}/03-uploaded-desktop.png` });
  });
});

test.describe("모바일", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("04 업로드 중 진행 차단 모바일", async ({ page }) => {
    await page.route("**/uploads", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await route.continue();
    });
    await page.goto(PATH);
    await fillToDocumentStep(page);
    await attachDocument(page, "진단서");
    await page.getByRole("button", { name: /다음/ }).click();
    await expect(
      page.getByRole("alert").filter({ hasText: "서류 업로드가 끝난 뒤에 진행할 수 있어요." }),
    ).toBeVisible();
    await page.screenshot({ path: `${DIR}/04-uploading-blocked-mobile.png` });
  });

  test("05 필수 서류 첨부 완료 모바일", async ({ page }) => {
    await page.goto(PATH);
    await fillToDocumentStep(page);
    await attachRequiredDocuments(page);
    await page.screenshot({ path: `${DIR}/05-uploaded-mobile.png` });
  });
});
