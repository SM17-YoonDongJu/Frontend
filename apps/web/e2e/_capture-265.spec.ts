import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools } from "./_region-helpers";

/** PR 스크린샷 캡처 헬퍼(#265). 테스트 아님 — CI 제외(testIgnore). */

const DIR = "../../.pr-assets/issue-265";

const PNG_1PX = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64",
);

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
  await hideQueryDevtools(page);
});

test.describe("PC 프로필 설정 사진 미리보기", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("01 사진 선택 직후 로컬 미리보기 즉시 표시", async ({ page }) => {
    await page.goto("/customer/mypage");

    await expect(async () => {
      await page.getByRole("button", { name: "프로필 수정" }).click();
      await expect(
        page.getByRole("heading", { name: "프로필 설정" }).filter({ visible: true }),
      ).toBeVisible();
    }).toPass({ timeout: 10000 });

    const dialog = page.getByRole("dialog").filter({ visible: true });
    await dialog
      .locator('input[type="file"]')
      .setInputFiles({ name: "avatar.png", mimeType: "image/png", buffer: PNG_1PX });

    // 업로드 응답(300ms 지연) 도착 전 — 로컬 objectURL 미리보기가 이미 보여야 한다.
    await expect(dialog.getByText("업로드 중…")).toBeVisible();
    await page.screenshot({ path: `${DIR}/01-avatar-local-preview.png` });
  });
});
