import { test, type Page } from "@playwright/test";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#144). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-144";
const PATH = "/customer/adjust-request";

const MOBILE = { width: 390, height: 900 };
const DESKTOP = { width: 1280, height: 900 };

test.beforeEach(async ({ page }) => {
  await hideQueryDevtools(page);
});

async function selectAccidentType(page: Page) {
  const medicalCard = page.getByRole("radio", { name: /실손 의료비/ });
  await test
    .expect(async () => {
      await medicalCard.click();
      await test.expect(medicalCard).toHaveAttribute("aria-checked", "true");
    })
    .toPass({ timeout: 10000 });
}

/** step1~5를 채워 step6(서류 업로드)까지 진행. */
async function goToDocuments(page: Page) {
  await selectAccidentType(page);
  await page.getByRole("button", { name: /다음/ }).click();

  await page.getByRole("heading", { name: "어떤 진단을 받으셨나요?" }).waitFor();
  await page.getByRole("button", { name: "통원", exact: true }).click();
  await page.getByPlaceholder("예) 우측 슬관절 골절").first().fill("우측 슬관절 골절");
  await page.getByRole("button", { name: "포함", exact: true }).click();
  await page.getByRole("button", { name: /다음/ }).click();

  await page.getByRole("heading", { name: "언제 있었던 일인가요?" }).waitFor();
  await page.getByRole("button", { name: "사고 발생일 선택" }).click();
  await page.getByRole("button", { name: /15일|15/ }).first().click();
  await page.getByRole("button", { name: /다음/ }).click();

  await page.getByRole("heading", { name: "제안받은 보험금이 있나요?" }).waitFor();
  await page.getByText("아직 제안받지 않았어요").click();
  await page.getByRole("button", { name: /다음/ }).click();

  await page.getByRole("heading", { name: "손해사정사에게 전할 말이 있나요?" }).waitFor();
  await page.getByRole("button", { name: /다음/ }).click();
  await page.getByRole("heading", { name: "관련 서류를 올려주세요" }).waitFor();
}

test("01 사고 유형 잠금 툴팁 데스크톱", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(PATH);
  await page.getByRole("heading", { name: "어떤 사고인가요?" }).waitFor();
  await page.getByRole("radio", { name: /교통사고/ }).hover({ force: true });
  await page.getByRole("tooltip").waitFor();
  await page.screenshot({ path: `${DIR}/01-step1-locked-tooltip-desktop.png`, fullPage: true });
});

test("02 사고 유형 잠금 툴팁 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto(PATH);
  await page.getByRole("heading", { name: "어떤 사고인가요?" }).waitFor();
  await page.getByText("교통사고").click({ force: true });
  await page.getByRole("tooltip").waitFor();
  await page.screenshot({ path: `${DIR}/02-step1-locked-tooltip-mobile.png`, fullPage: true });
});

test("03 검증 한글 안내 step1 데스크톱", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(PATH);
  await test
    .expect(async () => {
      await page.getByRole("button", { name: /다음/ }).click();
      await test
        .expect(page.getByText("사고 유형을 선택하세요."))
        .toBeVisible({ timeout: 2000 });
    })
    .toPass({ timeout: 10000 });
  await page.screenshot({ path: `${DIR}/03-step1-validation-desktop.png`, fullPage: true });
});

test("04 검증 한글 안내 step2 데스크톱", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(PATH);
  await selectAccidentType(page);
  await page.getByRole("button", { name: /다음/ }).click();
  await page.getByRole("heading", { name: "어떤 진단을 받으셨나요?" }).waitFor();
  await page.getByRole("button", { name: /다음/ }).click();
  await page.getByText("진단명을 입력하세요.").waitFor();
  await page.screenshot({ path: `${DIR}/04-step2-validation-desktop.png`, fullPage: true });
});

test("05 서류 업로드 드롭존 제거 데스크톱", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(PATH);
  await goToDocuments(page);
  await page.screenshot({ path: `${DIR}/05-step6-no-dropzone-desktop.png`, fullPage: true });
});

test("06 서류 업로드 드롭존 제거 모바일", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto(PATH);
  await goToDocuments(page);
  await page.screenshot({ path: `${DIR}/06-step6-no-dropzone-mobile.png`, fullPage: true });
});
