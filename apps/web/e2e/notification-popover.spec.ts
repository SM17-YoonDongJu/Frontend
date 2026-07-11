import { expect, test } from "@playwright/test";

/**
 * 파트너 헤더 알림 팝오버 E2E (이슈 #97).
 *
 * 원칙: 핵심 사용자 흐름만 — 팝오버 열람·그룹 표시 / 모두 읽음 / 닫기 /
 *       알림 설정 자동 오픈 / 모바일 페이지 이동.
 * 응답은 기본 MSW 핸들러(GET /users/me/notifications)가 제공
 * (알림 5건: 오늘 2건 안읽음 · 어제 2건 · 이전 1건 → 팝오버 그룹 오늘/이번 주/이전).
 * 팝오버는 md 이상 전용 UI라 "PC" 블록에서 뷰포트를 고정하고,
 * md 미만 벨은 알림 페이지 링크라 "모바일" 블록에서 검증한다.
 * 시간 라벨 포맷·아이콘 매핑은 zod·TS에 위임(의식적 미테스트).
 */

const PATH = "/partner";

test.describe("PC 알림 팝오버", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  async function openPopover(page: import("@playwright/test").Page) {
    await page.goto(PATH);
    await expect(async () => {
      await page.getByRole("button", { name: "알림", exact: true }).click();
      await expect(page.getByRole("dialog", { name: "알림" })).toBeVisible();
    }).toPass({ timeout: 10000 });
    return page.getByRole("dialog", { name: "알림" });
  }

  test("벨을 누르면 팝오버에 알림이 그룹으로 보인다", async ({ page }) => {
    const dialog = await openPopover(page);

    await expect(dialog.getByText("2 새 알림")).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "오늘", exact: true })).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "이번 주", exact: true })).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "이전", exact: true })).toBeVisible();
    await expect(dialog.getByRole("heading", { name: "검수가 완료됐어요" })).toBeVisible();
    await expect(dialog.getByLabel("읽지 않은 알림")).toHaveCount(2);
    await expect(dialog.getByRole("button", { name: "알림 설정" })).toBeVisible();
  });

  test("모두 읽음을 누르면 배지와 안읽음 표시가 사라진다", async ({ page }) => {
    const dialog = await openPopover(page);

    await expect(async () => {
      await dialog.getByRole("button", { name: "모두 읽음" }).click();
      await expect(dialog.getByLabel("읽지 않은 알림")).toHaveCount(0);
    }).toPass({ timeout: 10000 });

    await expect(dialog.getByText("새 알림")).toBeHidden();
    // 벨의 안읽음 점도 함께 사라진다(같은 쿼리 공유)
    await expect(page.getByLabel("읽지 않은 알림 있음")).toHaveCount(0);
  });

  test("Esc나 바깥을 누르면 팝오버가 닫힌다", async ({ page }) => {
    const dialog = await openPopover(page);

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await page.getByRole("button", { name: "알림", exact: true }).click();
    await expect(dialog).toBeVisible();
    await page.locator("body").click({ position: { x: 10, y: 500 } });
    await expect(dialog).toBeHidden();
  });

  test("알림 설정을 누르면 마이페이지에서 설정 모달이 바로 열린다", async ({ page }) => {
    const dialog = await openPopover(page);

    await dialog.getByRole("button", { name: "알림 설정" }).click();
    await expect(page).toHaveURL(/\/partner\/mypage\?panel=notifications/);
    await expect(page.getByRole("dialog", { name: "알림 설정" })).toBeVisible({ timeout: 15000 });

    // 모달을 닫으면 panel 파라미터가 제거돼 새로고침해도 다시 열리지 않는다
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "알림 설정" })).toBeHidden();
    await expect(page).toHaveURL(/\/partner\/mypage$/);
  });
});

test.describe("모바일", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("벨을 누르면 알림 페이지로 이동한다", async ({ page }) => {
    await page.goto(PATH);

    const bellLink = page.getByRole("link", { name: "알림", exact: true });
    await expect(async () => {
      await bellLink.click();
      await expect(page).toHaveURL(/\/notifications$/);
    }).toPass({ timeout: 10000 });

    await expect(page.getByRole("heading", { level: 1, name: "알림" })).toBeVisible();
  });
});
