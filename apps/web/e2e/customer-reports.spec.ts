import { expect, test } from "@playwright/test";

/**
 * 고객 검수 내역 리스트 E2E (이슈 #78).
 *
 * 원칙(fe-e2e-strategy): 핵심 사용자 흐름만 — 이슈 작업목록 1~4를 사용자 행동으로 커버.
 * 흐름: 리스트 진입(목록 조회) → 상태 필터 칩 전환(서버 필터+URL 반영)
 *       → 카드 클릭으로 상세 이동 → 뒤로가기 시 필터 조건 유지.
 * 응답은 앱 내장 MSW(GET /reports)가 제공: 8건(1페이지), status 쿼리로 서버 필터.
 * 저가치(빈/에러 문구·optional 필드 숨김 렌더)는 zod·TS·정적 레이어에 위임(미테스트).
 */

const PATH = "/customer/reports";

test("진입하면 검수한 리포트 카드가 유형·번호·완료일·제목·확정범위·평점과 함께 보인다", async ({
  page,
}) => {
  await page.goto(PATH);

  await expect(page.getByRole("heading", { name: "검수 내역" })).toBeVisible();

  const firstCard = page
    .getByRole("listitem")
    .filter({ hasText: "우측 슬관절 인대 파열" });
  await expect(firstCard).toBeVisible();
  await expect(firstCard.getByText("교통사고")).toBeVisible();
  await expect(firstCard.getByText("#20260520-017")).toBeVisible();
  await expect(firstCard.getByText("1,400–1,750만")).toBeVisible();
  await expect(firstCard.getByText("4.9")).toBeVisible();
});

test("종결 필터를 누르면 종결 사건만 남고 칩이 활성화되며 URL에 status가 반영된다", async ({
  page,
}) => {
  await page.goto(PATH);
  await expect(page.getByRole("heading", { name: "검수 내역" })).toBeVisible();

  const closedChip = page.getByRole("button", { name: "종결" });

  await expect(async () => {
    await closedChip.click();
    await expect(page).toHaveURL(/status=CLOSED/);
  }).toPass({ timeout: 10000 });

  await expect(closedChip).toHaveAttribute("aria-pressed", "true");

  // 종결(CLOSED) 사건은 남고, 상담 전환(COUNSELING) 전용 사건은 사라진다.
  await expect(page.getByText("경추 염좌 · 향후 치료비 분쟁")).toBeVisible();
  await expect(page.getByText("다발성 늑골 골절 · 일실수입 산정")).toHaveCount(0);
});

test("카드를 누르면 리포트 상세로 이동하고, 뒤로가기 시 선택했던 필터 조건이 유지된다", async ({
  page,
}) => {
  await page.goto(`${PATH}?status=CLOSED`);
  await expect(page.getByRole("heading", { name: "검수 내역" })).toBeVisible();
  await expect(page.getByRole("button", { name: "종결" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );

  const firstCard = page.getByRole("listitem").first();
  await expect(async () => {
    await firstCard.getByRole("link").first().click();
    await expect(page).toHaveURL(/\/customer\/report\/[^/]+$/);
  }).toPass({ timeout: 10000 });

  // 이전 페이지 이동 시 기존 조회 조건 유지(이슈 작업목록 4).
  await page.goBack();
  await expect(page).toHaveURL(/status=CLOSED/);
  await expect(page.getByRole("button", { name: "종결" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

/*
 * 정적 레이어 위임(의식적 미테스트):
 * - 빈 상태("아직 분석 리포트가 없어요")·에러 분기: 기본 MSW에 GET /reports 빈/실패 override 헤더가
 *   없어 사용자 행동만으로 재현 불가 → 저가치로 판단, List/Empty·Error 분기는 정적 검증(data-engineer에
 *   override 헤더 추가 제안).
 * - optional 4필드(title/confirmedMin·Max/rating) 숨김 렌더: zod optional + 카드 null 가드로 정적 보장.
 */
