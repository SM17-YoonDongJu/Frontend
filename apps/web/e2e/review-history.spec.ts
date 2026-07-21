import { expect, test } from "@playwright/test";

/**
 * 사정사 검수 내역 E2E (이슈 #59).
 *
 * 원칙(fe-e2e-strategy): 핵심 사용자 흐름 + 사용자에게 보이는 고가치 빈/에러만.
 * 흐름: 마이페이지 검수 내역 진입 → 카드 리스트 열람 → 필터 칩 전환(서버 필터+URL 반영)
 *       → 더보기(page append) → 빈 상태(no-data) → 권한/로그인 에러 분기.
 * 응답은 앱 내장 MSW(GET /adjusters/me/reviewed-reports)가 제공: 기본 14건(2페이지, size 10).
 * 빈/에러는 MSW 핸들러의 override 헤더(x-mock-reviewed / x-mock-failure)를 setExtraHTTPHeaders로 주입.
 * 저가치(필드 형식·optional 렌더 분기·no-filter-result 문구)는 zod·TS·정적 레이어에 위임(미테스트) — 아래 주석 참조.
 */

const PATH = "/partner/mypage/review-history";

test("진입하면 검수한 사건 카드가 유형·사건번호·완료일·제목·상태와 함께 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(page.getByRole("heading", { name: "검수 내역" })).toBeVisible();

  const firstCard = page
    .getByRole("listitem")
    .filter({ hasText: "십자인대 파열 등급 재산정" });
  await expect(firstCard).toBeVisible();
  // 사고유형 뱃지 — 제목에도 "후유장해" 접두가 있어 뱃지·제목 2요소가 잡힌다(카드에 유형 노출 확인).
  await expect(firstCard.getByText("후유장해").first()).toBeVisible();
  await expect(firstCard.getByText("#20260605-021")).toBeVisible();
  await expect(firstCard.getByText("06.05")).toBeVisible();
  await expect(firstCard.getByText("상담 전환")).toBeVisible();
});

test("채택 필터를 누르면 채택 사건만 남고 칩이 활성화되며 URL에 status가 반영된다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("heading", { name: "검수 내역" })).toBeVisible();

  const acceptedChip = page.getByRole("button", { name: "채택" });

  await expect(async () => {
    await acceptedChip.click();
    await expect(page).toHaveURL(/status=ACCEPTED/);
  }).toPass({ timeout: 10000 });

  await expect(acceptedChip).toHaveAttribute("aria-pressed", "true");

  // 채택(ACCEPTED) 사건은 남고, 상담 전환(COUNSELING) 전용 사건은 사라진다.
  await expect(page.getByText("일실수입 과소 산정")).toBeVisible();
  await expect(page.getByText("견관절 회전근개 파열")).toHaveCount(0);
});

test("더보기를 누르면 다음 페이지 사건이 이어 붙는다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("heading", { name: "검수 내역" })).toBeVisible();

  // 2페이지째 사건은 초기(10건)엔 없다.
  await expect(page.getByText("비급여 주사료 분쟁")).toHaveCount(0);

  const moreButton = page.getByRole("button", { name: "더보기" });
  await expect(moreButton).toBeVisible();

  await expect(async () => {
    await moreButton.click();
    await expect(page.getByText("비급여 주사료 분쟁")).toBeVisible();
  }).toPass({ timeout: 10000 });
});

test("검수 이력이 없으면 빈 안내가 보인다", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-reviewed": "empty" });
  await page.goto(PATH);

  await expect(page.getByText("아직 검수한 내역이 없어요")).toBeVisible();
});

test("권한이 없으면 접근 권한 안내가 보인다", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-failure": "reviewed-forbidden" });
  await page.goto(PATH);

  // 리스트 쿼리에 retry:false가 없어 기본 3회 재시도 backoff 후 에러 바운더리 노출 → 여유 타임아웃.
  await expect(page.getByRole("heading", { name: "접근 권한이 없어요" })).toBeVisible({
    timeout: 15000,
  });
});

test("로그인이 필요하면 로그인 안내가 보인다", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-failure": "reviewed-unauthorized" });
  await page.goto(PATH);

  await expect(page.getByRole("heading", { name: "로그인이 필요해요" })).toBeVisible({
    timeout: 15000,
  });
});

/*
 * 정적 레이어 위임(의식적 미테스트):
 * - no-filter-result 문구: UI 필터(CONSULTATION/CLOSED)는 기본 목데이터에서 모두 결과가 있어
 *   사용자 행동만으로 재현 불가(별도 MSW override 필요) → 저가치로 판단, List 분기 로직은 정적 검증.
 * - 일반 에러 재시도 버튼: 현 MSW는 forbidden/unauthorized(재시도 무의미, 버튼 없음)만 주입 가능.
 *   일반 에러+재시도 성공 플로우는 generic-error 주입 헤더 부재로 미검증 → data-engineer에 헤더 추가 제안.
 * - optional 4필드(accidentType/confirmedMin·Max/rating) 숨김 렌더: zod optional + 카드 null 가드로 정적 보장.
 */
