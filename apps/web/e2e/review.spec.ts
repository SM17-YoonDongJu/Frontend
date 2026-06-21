import { expect, test } from "@playwright/test";

/**
 * 손해사정사 검수 대기 리포트 목록 E2E (핵심 흐름).
 *
 * 원칙: 핵심 사용자 흐름만 — 목록 열람 + 초안 확인 + 보류. 응답은 MSW가 제공.
 */

const PATH = "/partner/review";
const CARD_NAME = /우측 슬관절/;

test("검수 대기 페이지에 진입하면 현황과 사건 목록이 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(page.getByRole("heading", { name: "검수 대기 리포트" })).toBeVisible();
  await expect(page.getByText("내 전문분야 매칭")).toBeVisible();
  await expect(
    page.getByText("우측 슬관절 후방십자인대 파열 · 등급 재산정 쟁점"),
  ).toBeVisible();
});

test("사건을 선택하면 우측에 AI 초안 정보가 보인다", async ({ page }) => {
  await page.goto(PATH);

  await page.getByRole("button", { name: CARD_NAME }).click();

  await expect(page.getByText("보상 가능 범위")).toBeVisible();
  await expect(page.getByRole("heading", { name: /AI가 짚은 쟁점/ })).toBeVisible();
  await expect(page.getByRole("button", { name: "검수 시작" })).toBeVisible();
});

test("사건을 보류하면 카드가 비활성된다", async ({ page }) => {
  await page.goto(PATH);

  await page.getByRole("button", { name: CARD_NAME }).click();
  await page.getByRole("button", { name: "보류" }).click();

  await expect(page.getByRole("button", { name: CARD_NAME })).toBeDisabled();
});
