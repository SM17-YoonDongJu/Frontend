import { expect, type Page } from "@playwright/test";

/** 업로드 검증을 통과하는 최소 크기 이미지(1px PNG). */
export const PNG_1PX = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

/** 첨부해야 진행할 수 있는 서류 슬롯. */
export const REQUIRED_DOCUMENT_LABELS = ["진단서", "보험증권"];

/** 분석 신청 퍼널 진입 경로. */
export const ADJUST_REQUEST_PATH = "/customer/adjust-request";

/** step1~5를 사용자 행동대로 채워 서류 업로드 단계까지 진행. */
export async function fillToDocumentStep(page: Page) {
  // step1 사고 유형 — 실손 의료비만 활성.
  // 하이드레이션 전 클릭 유실 방지: 선택될 때까지 재시도(toPass).
  const medicalCard = page.getByRole("radio", { name: /실손 의료비/ });
  await expect(async () => {
    await medicalCard.click();
    await expect(medicalCard).toHaveAttribute("aria-checked", "true");
  }).toPass({ timeout: 10000 });
  await page.getByRole("button", { name: /다음/ }).click();

  // step2 치료 정보 — 진단명(복수 입력) + 치료 형태 + 비급여
  await expect(page.getByRole("heading", { name: "어떤 진단을 받으셨나요?" })).toBeVisible();
  await page.getByRole("button", { name: "통원", exact: true }).click();
  await page.getByPlaceholder("예) 우측 슬관절 골절").fill("우측 슬관절 골절");
  await page.getByRole("button", { name: "포함", exact: true }).click();
  await page.getByRole("button", { name: /다음/ }).click();

  // step3 사고 일자 — 달력에서 날짜 선택
  await expect(page.getByRole("heading", { name: "언제 있었던 일인가요?" })).toBeVisible();
  await page.getByRole("button", { name: "사고 발생일 선택" }).click();
  await page
    .getByRole("button", { name: /15일|15/ })
    .first()
    .click();
  await page.getByRole("button", { name: /다음/ }).click();

  // step4 보험금 — 미제안 선택(숫자 입력 생략)
  await expect(page.getByRole("heading", { name: "제안받은 보험금이 있나요?" })).toBeVisible();
  await page.getByText("아직 제안받지 않았어요").click();
  await page.getByRole("button", { name: /다음/ }).click();

  // step5 전할 말 — 선택 단계, 적지 않고 통과
  await expect(page.getByRole("heading", { name: "손해사정사에게 전할 말이 있나요?" })).toBeVisible();
  await page.getByRole("button", { name: /다음/ }).click();

  await expect(page.getByRole("heading", { name: "관련 서류를 올려주세요" })).toBeVisible();
}

/** 서류 슬롯 1칸에 파일 선택(숨은 file input은 라벨로 찾는다). */
export async function attachDocument(page: Page, label: string) {
  await page.getByLabel(`${label} 파일 선택`).setInputFiles({
    name: `${label}.png`,
    mimeType: "image/png",
    buffer: PNG_1PX,
  });
}

/** 필수 서류를 올리고 업로드 완료까지 기다린다. */
export async function attachRequiredDocuments(page: Page) {
  for (const label of REQUIRED_DOCUMENT_LABELS) {
    await attachDocument(page, label);
    await expect(page.getByRole("button", { name: `${label} 삭제` })).toBeVisible();
  }
}
