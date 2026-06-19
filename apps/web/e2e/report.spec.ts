import { expect, test } from "@playwright/test";

/**
 * 고객 보험 보상 분석 리포트 E2E (happy-path).
 *
 * 원칙: 핵심 사용자 흐름만 — 리포트 열람 + PDF 저장. 응답은 MSW가 제공.
 */

const PATH = "/customer/report/test-id-123";

test("리포트에 진입하면 검수 결과 핵심 정보가 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(page.getByRole("heading", { name: "보험 보상 분석 리포트" })).toBeVisible();

  // 손해사정사 검수 의견
  await expect(
    page.getByRole("heading", { name: "정우성 손해사정사의 검수 의견" }),
  ).toBeVisible();

  // 예상 보상 범위
  await expect(page.getByText("1,350~1,700만원").first()).toBeVisible();

  // 쟁점 검토
  await expect(page.getByRole("heading", { name: "검토 의견 및 보완 사항" })).toBeVisible();
  await expect(page.getByText("외모추상 특약 누락")).toBeVisible();

  // 보장 정보
  await expect(page.getByRole("heading", { name: "적용 가능 보장" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "누락 가능 특약" })).toBeVisible();

  // 상담 연결
  await expect(page.getByRole("button", { name: "이 의견으로 상담하기" })).toBeVisible();
});

test("PDF 저장을 누르면 리포트가 PDF로 다운로드된다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("heading", { name: "보험 보상 분석 리포트" })).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "PDF 저장" }).click();
  const download = await downloadPromise;

  expect(download.suggestedFilename()).toMatch(/\.pdf$/);
});
