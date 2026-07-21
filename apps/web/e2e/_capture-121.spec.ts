import { expect, test } from "@playwright/test";

/** PR 스크린샷 캡처 헬퍼(#121). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-121";
const PATH = "/customer/adjust-request";

/** 전할 말 단계는 가드 때문에 직접 진입이 막힌다 — 선행 4단계를 채워서 도달한다. */
async function goToQuestionStep(page: import("@playwright/test").Page) {
  await page.goto(PATH);

  const medicalCard = page.getByRole("radio", { name: /실손 의료비/ });
  await expect(async () => {
    await medicalCard.click();
    await expect(medicalCard).toHaveAttribute("aria-checked", "true");
  }).toPass({ timeout: 10000 });
  await page.getByRole("button", { name: /다음/ }).click();

  await page.getByRole("button", { name: "통원", exact: true }).click();
  await page.getByPlaceholder("예) 우측 슬관절 골절").first().fill("우측 슬관절 골절");
  await page.getByRole("button", { name: "포함", exact: true }).click();
  await page.getByRole("button", { name: /다음/ }).click();

  await page.getByRole("button", { name: "사고 발생일 선택" }).click();
  await page
    .getByRole("button", { name: /15일|15/ })
    .first()
    .click();
  await page.getByRole("button", { name: /다음/ }).click();

  await page.getByText("아직 제안받지 않았어요").click();
  await page.getByRole("button", { name: /다음/ }).click();

  await expect(page.getByRole("heading", { name: "손해사정사에게 전할 말이 있나요?" })).toBeVisible();
}

test.describe("PC", () => {
  test.use({ viewport: { width: 1280, height: 1010 } });

  test("01 전할 말 단계 빈 상태", async ({ page }) => {
    await goToQuestionStep(page);
    await page.screenshot({ path: `${DIR}/01-question-desktop.png` });
  });

  test("02 전할 말 단계 입력 상태", async ({ page }) => {
    await goToQuestionStep(page);
    await page
      .getByRole("textbox", { name: "궁금한 점 · 특이사항" })
      .fill("무릎 수술을 두 번 받았는데 두 번 다 보상되는지 궁금해요.");
    await page.screenshot({ path: `${DIR}/02-question-desktop-filled.png` });
  });

  test("03 확인 단계 요약에 전할 말 노출", async ({ page }) => {
    await goToQuestionStep(page);
    await page
      .getByRole("textbox", { name: "궁금한 점 · 특이사항" })
      .fill("무릎 수술을 두 번 받았는데 두 번 다 보상되는지 궁금해요.");
    await page.getByRole("button", { name: /다음/ }).click();
    await expect(page.getByRole("heading", { name: "관련 서류를 올려주세요" })).toBeVisible();
    await page.getByRole("button", { name: /다음/ }).click();
    await expect(page.getByRole("heading", { name: "분석 준비가 끝났어요" })).toBeVisible();
    await page.screenshot({ path: `${DIR}/03-confirm-desktop.png` });
  });
});

test.describe("모바일", () => {
  test.use({ viewport: { width: 402, height: 904 } });

  test("04 전할 말 단계 빈 상태", async ({ page }) => {
    await goToQuestionStep(page);
    await page.screenshot({ path: `${DIR}/04-question-mobile.png` });
  });
});
