import { expect, test } from "@playwright/test";

/**
 * 고객 내 리포트 목록 E2E (이슈 #128).
 *
 * 원칙(fe-e2e-strategy): 핵심 사용자 흐름 + 사용자에게 보이는 고가치 빈 상태만.
 * 흐름: 목록 진입(첫 페이지 5건) → 더보기(다음 페이지 누적 총 8건) → 카드 CTA로 그 건의 받은 제안 목록 이동
 *       → 빈 상태(0건) → 대시보드 "전체 보기" 진입 → 모바일 뷰포트 정상 렌더.
 * 응답은 앱 내장 MSW(GET /reports?page=&size=)가 제공: page 지정 시 소스 8건을 size 5로 2페이지(5+3).
 * 빈 상태는 x-mock-scenario 헤더로 빈 리스트 envelope를 강제(고가치 — 사용자가 실제 보는 화면).
 * 저가치(offeredAmount·treatment 형식·optional 렌더 분기·에러 code 문구)는 zod·TS 정적 레이어에 위임(미테스트) — 아래 주석 참조.
 */

const PATH = "/customer/reports";
const DASHBOARD_PATH = "/customer/dashboard";

// 데스크톱 뷰 검증(모바일 렌더는 마지막 describe에서 별도 뷰포트로).
test.describe("내 리포트 목록", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("진입하면 첫 페이지 리포트 카드가 유형·사건번호·금액과 함께 보인다", async ({ page }) => {
    await page.goto(PATH);

    await expect(page.getByRole("heading", { name: "내 리포트" })).toBeVisible();

    // 첫 페이지 5건(size 5) — 카드는 article 하나씩.
    await expect(page.getByRole("article")).toHaveCount(5);

    // 맨 앞 MATCHED 교통사고 카드(reportNo 20260520-017, claimed 14,000,000~17,500,000 → 1,400 – 1,750 만원).
    const firstCard = page
      .getByRole("article")
      .filter({ hasText: "No.20260520-017" });
    await expect(firstCard).toBeVisible();
    // 목록 응답에 title이 없어 accidentType·treatment로 파생한 "분석 요청" 제목에 유형이 드러난다.
    await expect(firstCard.getByText("교통사고").first()).toBeVisible();
    await expect(firstCard.getByText(/1,400\s*–\s*1,750/)).toBeVisible();
    // 카드 CTA는 그 건에 도착한 제안 목록으로 유도.
    await expect(firstCard.getByRole("link", { name: /제안 \d+건 보기/ })).toBeVisible();
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
    await expect(page.getByRole("article")).toHaveCount(8);
    await expect(moreButton).toHaveCount(0);

    // 종결(CLOSED) 건은 2페이지에 있다 — 5개 상태 중 마지막 상태까지 카드가 렌더되는지 확인.
    const closedCard = page
      .getByRole("article")
      .filter({ hasText: "No.20260403-208" });
    await expect(closedCard.getByText("종결")).toBeVisible();
  });

  test("카드의 제안 보기를 누르면 그 건의 받은 제안 목록으로 이동한다", async ({ page }) => {
    await page.goto(PATH);
    await expect(page.getByRole("heading", { name: "내 리포트" })).toBeVisible();

    const firstCard = page
      .getByRole("article")
      .filter({ hasText: "No.20260520-017" });

    await expect(async () => {
      await firstCard.getByRole("link", { name: /제안 \d+건 보기/ }).click();
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
    await expect(page.getByRole("article")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "더보기" })).toHaveCount(0);
  });
});

test.describe("대시보드에서 목록 진입", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("대시보드 전체 보기를 누르면 내 리포트 목록으로 이동한다", async ({ page }) => {
    await page.goto(DASHBOARD_PATH);

    await expect(async () => {
      await page.getByRole("link", { name: "전체 보기" }).click();
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
    await expect(page.getByRole("article")).toHaveCount(5);
    await expect(
      page.getByRole("article").filter({ hasText: "No.20260520-017" }),
    ).toBeVisible();
  });
});

/*
 * 정적 레이어 위임(의식적 미테스트):
 * - offeredAmount·treatment optional/nullable 렌더: 리스트 카드는 필수 필드만 소비 → zod optional·nullable + TS로 정적 보장.
 * - 에러 상태(LOGIN_REQUIRED·일반 에러) 문구·재시도: /reports는 x-mock-scenario에 empty만 있고 목록 전용 실패 시나리오 주입 헤더가 없어
 *   사용자 행동만으로 재현 불가 → 저가치로 판단, 에러 code→문구 매핑은 정적 검증. (전용 실패 헤더 추가 시 E2E 승격 여지.)
 * - 필드 형식·범위(claimedMin/Max nonnegative 등): zod가 런타임 강제(테스트 불필요).
 */
