import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * 파트너 대시보드 모바일 E2E (happy-path CUJ, 이슈 #45).
 *
 * 원칙(메모리 fe-e2e-strategy): 핵심 사용자 흐름·통합 happy-path만. 엣지/형식검증은 zod·TS에 위임(미테스트).
 * 응답은 앱 내장 MSW 기본 핸들러가 제공(요약 4수치·검수 대기 4건). 에러만 x-mock-failure 헤더로 override.
 *
 * 흐름: 요약 4카드 수치 표시 / 검수 대기 카드 렌더(배지·지역·제목·케이스번호)
 *       / 검수 시작 → /partner/review/{reportId} 이동 / 전체보기 → /partner/review
 *       / 대시보드 요약 로드 실패 시 섹션 에러 표시.
 *
 * 범위 제외(설계 확정): 하단 탭바 미구현, AI 신뢰도 미표시.
 * 주의: 모바일(md:hidden)·PC(hidden md:block) 트리가 같은 DOM에 공존 → 항상 보이는 요소로만 좁힌다(visible 필터).
 */

const PATH = "/partner";

// 모바일 트리(md:hidden, <768px)를 강제로 렌더 — 프로젝트 프리셋 뷰포트를 덮어쓴다.
test.use({ viewport: { width: 402, height: 900 } });

const visibleText = (page: Page, text: string | RegExp, exact?: boolean): Locator =>
  page.getByText(text, exact ? { exact } : undefined).filter({ visible: true });

test("요약 4카드 수치가 표시된다", async ({ page }) => {
  await page.goto(PATH);

  await expect(visibleText(page, "검수 대기", true)).toBeVisible();
  await expect(visibleText(page, "진행 중", true)).toBeVisible();
  await expect(visibleText(page, "이번 달 완료", true)).toBeVisible();
  await expect(visibleText(page, "고객 평점", true)).toBeVisible();

  // MSW 기본값: pending 4 / inProgress 2 / monthly 14 / rating 4.9
  await expect(visibleText(page, "4건", true)).toBeVisible();
  await expect(visibleText(page, "2건")).toBeVisible();
  await expect(visibleText(page, "14건")).toBeVisible();
  await expect(visibleText(page, "4.9")).toBeVisible();
});

test("검수 대기 카드에 배지·지역·제목·케이스번호가 렌더된다", async ({ page }) => {
  await page.goto(PATH);

  // createdAt desc 정렬 시 최상단 = 6/19 09:00 항목
  const topCard = page
    .getByRole("listitem")
    .filter({ visible: true })
    .filter({ hasText: "우측 슬관절 인대 파열" });
  await expect(topCard).toBeVisible();

  await expect(topCard.getByText("후유장해")).toBeVisible();
  await expect(topCard.getByText("서울 강남")).toBeVisible();
  await expect(topCard.getByText(/등급 재산정/)).toBeVisible();
  // 마감일 필드는 계약 정리로 제거 — 케이스번호 표기로 대체
  await expect(topCard.getByText("#042")).toBeVisible();

  // 섹션 헤더 카운트 "검수 대기 4"
  await expect(
    page.getByRole("heading", { name: /검수 대기\s*4/ }).filter({ visible: true }),
  ).toBeVisible();
});

test("검수 시작을 누르면 해당 리포트 상세로 이동한다", async ({ page }) => {
  await page.goto(PATH);

  const topCard = page
    .getByRole("listitem")
    .filter({ visible: true })
    .filter({ hasText: "우측 슬관절 인대 파열" });
  const startLink = topCard.getByRole("link", { name: /검수 시작/ });
  await expect(startLink).toBeVisible();

  await expect(async () => {
    await startLink.click();
    await expect(page).toHaveURL(/\/partner\/review\/[0-9a-f-]{36}/);
  }).toPass({ timeout: 10000 });
});

test("전체보기를 누르면 검수 대기 목록으로 이동한다", async ({ page }) => {
  await page.goto(PATH);

  const allLink = page.getByRole("link", { name: "전체보기" }).filter({ visible: true });
  await expect(allLink).toBeVisible();

  await expect(async () => {
    await allLink.click();
    await expect(page).toHaveURL(/\/partner\/review$/);
  }).toPass({ timeout: 10000 });
});

test("대시보드 요약 로드에 실패하면 섹션 에러가 표시된다", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-failure": "home" });
  await page.goto(PATH);

  // useSuspenseQuery 기본 재시도(3회)·백오프를 지나 에러 바운더리에 도달할 때까지 여유를 둔다.
  await expect(visibleText(page, "정보를 불러오지 못했어요")).toBeVisible({ timeout: 20000 });
  await expect(
    page.getByRole("button", { name: "다시 시도" }).filter({ visible: true }),
  ).toBeVisible();
});
