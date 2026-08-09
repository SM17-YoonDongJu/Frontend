import { expect, test, type Page } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * 고객 내 리포트 목록 E2E (이슈 #128, #262 화면 통합).
 *
 * 원칙(fe-e2e-strategy): 핵심 사용자 흐름 + 사용자에게 보이는 고가치 빈 상태만.
 * 흐름: 목록 진입(첫 페이지 5건) → 더보기(다음 페이지 누적 총 8건) → 카드 선택으로 그 건의 받은 제안 목록 이동
 *       → 빈 상태(0건) → 대시보드 "전체 보기" 진입 → 받은 제안 목록 경로 리다이렉트 → 모바일 뷰포트 정상 렌더.
 * 응답은 앱 내장 MSW(GET /reports?page=&size=)가 제공: page 지정 시 소스 8건을 size 5로 2페이지(5+3).
 * 빈 상태는 x-mock-scenario 헤더로 빈 리스트 응답을 강제(고가치 — 사용자가 실제 보는 화면).
 * 저가치(offeredAmount·treatment 형식·optional 렌더 분기·에러 code 문구)는 zod·TS 정적 레이어에 위임(미테스트) — 아래 주석 참조.
 */

const PATH = "/customer/reports";
const PROPOSALS_PATH = "/customer/proposals";
const DASHBOARD_PATH = "/customer/dashboard";

/** 헤더·탭바 등 다른 목록과 섞이지 않게 카드 목록으로 한정. */
const cards = (page: Page) =>
  page.getByRole("list", { name: "리포트 목록" }).getByRole("listitem");

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
});

// 데스크톱 뷰 검증(모바일 렌더는 마지막 describe에서 별도 뷰포트로).
test.describe("내 리포트 목록", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("진입하면 첫 페이지 리포트 카드가 상태·사건번호와 함께 보인다", async ({ page }) => {
    await page.goto(PATH);

    await expect(page.getByRole("heading", { name: "내 리포트" })).toBeVisible();

    // 첫 페이지 5건(size 5) — 카드는 목록 항목 하나씩.
    await expect(cards(page)).toHaveCount(5);

    // 맨 앞 종결 교통사고 카드(reportNo 20260520-017, 제안 3건).
    const firstCard = cards(page).filter({ hasText: "No.20260520-017" });
    await expect(firstCard).toBeVisible();
    // 목록 응답에 title이 없으면 accidentType·treatment로 제목을 파생한다.
    await expect(firstCard.getByText("교통사고 · 후유장해 분석 요청")).toBeVisible();
    await expect(firstCard.getByText("종결", { exact: true })).toBeVisible();
    await expect(firstCard.getByText("상담 종결 · 김도현 사정사")).toBeVisible();
    await expect(firstCard.getByText("제안 3 건")).toBeVisible();

    // 검수 대기 건은 제안을 아직 받을 수 없다는 안내가 붙는다.
    const awaitingCard = cards(page).filter({ hasText: "No.20260512-009" });
    await expect(awaitingCard.getByText("검수 대기 중")).toBeVisible();
    await expect(awaitingCard.getByText("검수 완료 후 제안을 받을 수 있어요")).toBeVisible();
  });

  test("더보기를 누르면 다음 페이지 리포트가 이어 붙어 총 8건이 된다", async ({ page }) => {
    await page.goto(PATH);
    await expect(page.getByRole("heading", { name: "내 리포트" })).toBeVisible();

    // 2페이지째 리포트(reportNo 20260326-142)는 초기 5건엔 없다.
    await expect(page.getByText("No.20260326-142")).toHaveCount(0);

    const moreButton = page.getByRole("button", { name: "더보기" });
    await expect(moreButton).toBeVisible();

    await expect(async () => {
      await moreButton.click();
      await expect(page.getByText("No.20260326-142")).toBeVisible();
    }).toPass({ timeout: 10000 });

    // 5 + 3 = 8건 누적, 마지막 페이지라 더보기는 사라진다.
    await expect(cards(page)).toHaveCount(8);
    await expect(moreButton).toHaveCount(0);
  });

  test("카드를 누르면 그 건의 받은 제안 목록으로 이동한다", async ({ page }) => {
    await page.goto(PATH);
    await expect(page.getByRole("heading", { name: "내 리포트" })).toBeVisible();

    const firstCard = cards(page).filter({ hasText: "No.20260520-017" });

    await expect(async () => {
      await firstCard.getByRole("link").click();
      await expect(page).toHaveURL(/\/customer\/proposals\/[0-9a-f-]+/);
    }).toPass({ timeout: 10000 });
  });

  test("리포트가 0건이면 빈 안내와 새 분석 시작 CTA가 보인다", async ({ page }) => {
    // MSW 서비스워커가 fetch를 가로채므로 page.route가 아닌 런타임 시나리오 헤더로 빈 리스트를 강제한다.
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "reports-empty" });
    await page.goto(PATH);

    await expect(page.getByText("아직 분석한 리포트가 없어요")).toBeVisible();
    await expect(page.getByRole("link", { name: "새 분석 시작" })).toBeVisible();
    // 카드도 더보기도 없다.
    await expect(cards(page)).toHaveCount(0);
    await expect(page.getByRole("button", { name: "더보기" })).toHaveCount(0);
  });
});

test.describe("통합 전 경로로 진입", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("받은 제안 목록 경로로 들어오면 내 리포트 목록으로 이동한다", async ({ page }) => {
    await page.goto(PROPOSALS_PATH);

    await expect(page).toHaveURL(/\/customer\/reports/);
    await expect(page.getByRole("heading", { name: "내 리포트" })).toBeVisible();
  });

  test("대시보드 내 분석 리포트의 전체 보기를 누르면 내 리포트 목록으로 이동한다", async ({
    page,
  }) => {
    await page.goto(DASHBOARD_PATH);

    // 개편된 대시보드엔 "전체 보기" 링크가 제안 비교·내 분석 리포트 두 섹션에 있어
    // 내 분석 리포트 헤더로 한정해 클릭한다.
    const reportsHeader = page
      .getByRole("heading", { name: "내 분석 리포트" })
      .locator("xpath=ancestor::header[1]");

    await expect(async () => {
      await reportsHeader.getByRole("link", { name: "전체 보기" }).click();
      await expect(page).toHaveURL(/\/customer\/reports/);
    }).toPass({ timeout: 10000 });

    await expect(page.getByRole("heading", { name: "내 리포트" })).toBeVisible();
  });
});

test.describe("모바일 목록 렌더", () => {
  test.use({ viewport: { width: 400, height: 900 } });

  test("모바일 뷰포트로 진입해도 리포트 카드가 정상 렌더된다", async ({ page }) => {
    await page.goto(PATH);

    await expect(page.getByRole("heading", { name: "내 리포트" })).toBeVisible();
    await expect(cards(page)).toHaveCount(5);
    await expect(
      cards(page).filter({ hasText: "No.20260520-017" }),
    ).toBeVisible();
  });
});

/*
 * 정적 레이어 위임(의식적 미테스트):
 * - offeredAmount·treatment optional/nullable 렌더: 리스트 카드는 필수 필드만 소비 → zod optional·nullable + TS로 정적 보장.
 * - 에러 상태(LOGIN_REQUIRED·일반 에러) 문구·재시도: /reports는 x-mock-scenario에 empty만 있고 목록 전용 실패 시나리오 주입 헤더가 없어
 *   사용자 행동만으로 재현 불가 → 저가치로 판단, 에러 code→문구 매핑은 정적 검증. (전용 실패 헤더 추가 시 E2E 승격 여지.)
 * - 중복 행 제거 가드: 기본 핸들러가 리포트 단위 응답이라 사용자 행동으로 재현 불가 → 백엔드 수정 후 함께 제거될 임시 코드라 미테스트.
 */
