import { expect, test } from "@playwright/test";

/**
 * 검수 대기 리스트(모바일 재설계) E2E — 핵심 흐름 (이슈 #62).
 *
 * 원칙: 핵심 사용자 흐름만 — 목록 진입 열람 / 유형 칩 필터링(URL ?type= 동기화) / 검수 상세 이동.
 * 응답은 기본 MSW 핸들러가 제공(검수 대기 4건: 후유장해 2·교통사고 1·실손 1).
 * 빈 상태(list:[])·403 FORBIDDEN 화면은 MSW 핸들러 override가 필요하나, 이 repo E2E 하네스에
 *   핸들러 override 경로가 없어(앱 MSW 서비스워커가 page.route보다 앞서 응답) 실행 보류.
 *   → SKILL "정적 위임" 원칙에 따라 시나리오만 명세(04_qa 리포트 참조), 거짓 통과로 넣지 않는다.
 */

const PATH = "/partner/review";

test("검수 대기 페이지에 진입하면 헤더와 사건 카드가 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(page.getByRole("heading", { name: "검수 대기" })).toBeVisible();
  await expect(page.getByText("매칭 높은 순으로 정렬했어요.")).toBeVisible();
  await expect(
    page.getByText("우측 슬관절 인대 파열 · 등급 재산정"),
  ).toBeVisible();
});

test("후유장해 칩을 선택하면 URL에 type이 붙고 해당 유형만 남는다", async ({ page }) => {
  await page.goto(PATH);

  // 필터 전: 교통사고 카드가 보인다
  await expect(page.getByText("다발성 늑골 골절 · 일실수입 과소")).toBeVisible();

  await expect(async () => {
    await page.getByRole("button", { name: "후유장해", exact: true }).click();
    await expect(page).toHaveURL(/[?&]type=disability/);
  }).toPass({ timeout: 10000 });

  // 필터 후: 후유장해 카드는 남고 교통사고 카드는 사라진다
  await expect(
    page.getByText("우측 슬관절 인대 파열 · 등급 재산정"),
  ).toBeVisible();
  await expect(
    page.getByText("다발성 늑골 골절 · 일실수입 과소"),
  ).toHaveCount(0);
});

test("전체 칩으로 되돌리면 type 파라미터가 사라지고 모든 유형이 보인다", async ({ page }) => {
  await page.goto(`${PATH}?type=disability`);

  await expect(page.getByText("다발성 늑골 골절 · 일실수입 과소")).toHaveCount(0);

  await expect(async () => {
    await page.getByRole("button", { name: "전체", exact: true }).click();
    await expect(page).toHaveURL(/\/partner\/review$/);
  }).toPass({ timeout: 10000 });

  await expect(page.getByText("다발성 늑골 골절 · 일실수입 과소")).toBeVisible();
});

test("카드의 검수 버튼을 누르면 검수 상세로 이동한다", async ({ page }) => {
  await page.goto(PATH);

  const card = page
    .getByRole("listitem")
    .filter({ hasText: "우측 슬관절 인대 파열 · 등급 재산정" });

  await expect(async () => {
    await card.getByRole("link", { name: /검수/ }).click();
    await expect(page).toHaveURL(/\/partner\/review\/[0-9a-f-]{36}/);
  }).toPass({ timeout: 10000 });
});

/**
 * status 필터 탭바 (이슈 #94).
 * 기본 MSW 분포: 전체 10 · 전송 완료 2 · 상담 전환 2 · 미채택 1 · 종결 1.
 */

test("status 탭바가 상태별 건수와 함께 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(page.getByRole("tab", { name: "전체 10" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "전송 완료 2" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "상담 전환 2" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "미채택 1" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "종결 1" })).toBeVisible();
});

test("전송 완료 탭을 선택하면 URL에 status가 붙고 해당 상태만 남는다", async ({ page }) => {
  await page.goto(PATH);

  await expect(page.getByText("우측 슬관절 인대 파열 · 등급 재산정")).toBeVisible();

  await expect(async () => {
    await page.getByRole("tab", { name: /전송 완료/ }).click();
    await expect(page).toHaveURL(/[?&]status=AWAITING_ADOPTION/);
  }).toPass({ timeout: 10000 });

  await expect(page.getByText("경추 염좌 · 향후 치료비 미반영")).toBeVisible();
  await expect(page.getByText("우측 슬관절 인대 파열 · 등급 재산정")).toHaveCount(0);
});

test("전체 탭으로 되돌리면 status 파라미터가 사라지고 모든 상태가 보인다", async ({ page }) => {
  await page.goto(`${PATH}?status=CLOSED`);

  await expect(page.getByText("가재도구 손해액 산정")).toBeVisible();
  await expect(page.getByText("우측 슬관절 인대 파열 · 등급 재산정")).toHaveCount(0);

  await expect(async () => {
    await page.getByRole("tab", { name: /^전체/ }).click();
    await expect(page).toHaveURL(/\/partner\/review$/);
  }).toPass({ timeout: 10000 });

  await expect(page.getByText("우측 슬관절 인대 파열 · 등급 재산정")).toBeVisible();
});

test("status 탭과 유형 칩 필터가 함께 적용된다", async ({ page }) => {
  await page.goto(PATH);

  await expect(async () => {
    await page.getByRole("tab", { name: /전송 완료/ }).click();
    await expect(page).toHaveURL(/[?&]status=AWAITING_ADOPTION/);
  }).toPass({ timeout: 10000 });

  await expect(async () => {
    await page.getByRole("button", { name: "후유장해", exact: true }).click();
    await expect(page).toHaveURL(/[?&]type=disability/);
  }).toPass({ timeout: 10000 });

  await expect(page.getByText("견관절 회전근개 파열 · 등급 재산정")).toBeVisible();
  await expect(page.getByText("경추 염좌 · 향후 치료비 미반영")).toHaveCount(0);
});

test("결과 없는 status·유형 조합이면 빈 상태가 보인다", async ({ page }) => {
  await page.goto(`${PATH}?status=CLOSED&type=medical_indemnity`);

  await expect(page.getByText("종결 실손 케이스가 없어요")).toBeVisible();
  await expect(page.getByText("다른 상태나 유형을 선택하거나 잠시 후 다시 확인해 주세요.")).toBeVisible();
});
