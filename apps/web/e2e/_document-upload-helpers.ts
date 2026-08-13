import { expect, type Page } from "@playwright/test";

/** 업로드 검증을 통과하는 최소 크기 이미지(1px PNG). */
export const PNG_1PX = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

/** 첨부해야 진행할 수 있는 서류 슬롯. */
export const REQUIRED_DOCUMENT_LABELS = ["진단서", "보험증권"];

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
