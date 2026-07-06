import { expect, test } from "@playwright/test";

/**
 * 모바일 대시보드 홈 E2E (happy-path + 빈 상태, 이슈 #63).
 *
 * 원칙: 핵심 사용자 흐름만 — <md 모바일 홈 렌더 / 주요 진입 링크 이동 / 리포트 0건 빈 상태.
 * 응답은 기본 MSW 핸들러가 제공(GET /users/me 윤서, GET /reports 2건: MATCHED offeredAmount 8_500_000 + AWAITING null).
 * 빈 상태는 GET /reports를 빈 리스트 envelope로 override(고가치 — 사용자가 실제 보는 화면).
 * offeredAmount 형식·범위 검증은 zod(nonnegative·nullable)·TS에 위임(미테스트).
 * ≥md 데스크톱 회귀는 dashboard.spec.ts가 담당.
 */

const PATH = "/customer/dashboard";

// 모바일 뷰포트 고정(chromium 프로젝트 포함 전 프로젝트에서 <md 분기를 결정적으로 검증)
test.use({ viewport: { width: 400, height: 900 } });

test.describe("모바일 홈 렌더", () => {
  test("진입하면 닉네임 인사·히어로·최근 리포트 금액·제안 마커가 보인다", async ({
    page,
  }) => {
    await page.goto(PATH);

    // 인사 헤더(GET /users/me → nickname 윤서). 데스크톱 배너("윤서 님, 안녕하세요")가
    // DOM에 hidden으로 공존하므로 exact 매칭으로 모바일 노드만 지정한다.
    await expect(page.getByText("안녕하세요", { exact: true })).toBeVisible();
    await expect(page.getByText("윤서 님", { exact: true })).toBeVisible();

    // 히어로 타이틀
    await expect(
      page.getByRole("heading", { name: /받은 보험금/ }),
    ).toBeVisible();

    // 최근 리포트 카드 — MATCHED 교통사고 claimed 14,000,000~17,500,000 → 1,400 – 1,750 만원.
    // 데스크톱 리포트 섹션이 DOM에 hidden으로 공존(동일 문자열)하므로 보이는 노드만 지정.
    await expect(
      page.getByText(/1,400\s*–\s*1,750/).filter({ visible: true }),
    ).toBeVisible();

    // 제안 마커 — offeredAmount 8,500,000 → 제안 850만
    await expect(page.getByText("제안 850만")).toBeVisible();
  });
});

test.describe("모바일 홈 이동", () => {
  test("히어로 새 분석 시작을 누르면 분석 신청으로 이동한다", async ({
    page,
  }) => {
    await page.goto(PATH);

    await expect(async () => {
      await page.getByRole("link", { name: /새 분석 시작/ }).click();
      await expect(page).toHaveURL(/\/customer\/adjust-request/);
    }).toPass({ timeout: 10000 });
  });

  test("빠른 실행 문서로 시작을 누르면 분석 신청으로 이동한다", async ({
    page,
  }) => {
    await page.goto(PATH);

    await expect(async () => {
      await page.getByRole("link", { name: /문서로 시작/ }).click();
      await expect(page).toHaveURL(/\/customer\/adjust-request/);
    }).toPass({ timeout: 10000 });
  });

  test("빠른 실행 보상 상담을 누르면 상담으로 이동한다", async ({ page }) => {
    await page.goto(PATH);

    await expect(async () => {
      await page.getByRole("link", { name: /보상 상담/ }).click();
      await expect(page).toHaveURL(/\/customer\/chat/);
    }).toPass({ timeout: 10000 });
  });

  test("전체보기를 누르면 리포트 목록으로 이동한다", async ({ page }) => {
    await page.goto(PATH);

    await expect(async () => {
      await page.getByRole("link", { name: "전체보기" }).click();
      await expect(page).toHaveURL(/\/customer\/reports/);
    }).toPass({ timeout: 10000 });
  });
});

test.describe("모바일 홈 빈 상태", () => {
  test("리포트가 0건이면 빈 상태와 새 분석 시작 CTA가 보인다", async ({
    page,
  }) => {
    // MSW 서비스워커가 fetch를 가로채므로 page.route로는 override되지 않는다.
    // 이 repo의 런타임 시나리오 주입 방식(x-mock-* 헤더)을 따라 빈 리스트를 강제한다.
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "reports-empty" });
    await page.goto(PATH);

    // 데스크톱 리포트 섹션도 빈 상태 메시지를 hidden으로 렌더하므로 보이는 노드만 지정.
    await expect(
      page.getByText("아직 분석한 리포트가 없어요").filter({ visible: true }),
    ).toBeVisible();
    await expect(page.getByText(/새 분석을 시작하면 예상 보상 범위와 쟁점을/)).toBeVisible();
    // 빈 상태 카드에는 CTA가 없고(시안 916-23766) 진입은 히어로 버튼 하나만 보인다.
    await expect(
      page.getByRole("link", { name: "새 분석 시작" }).filter({ visible: true }),
    ).toHaveCount(1);
    // 리포트가 없으면 전체보기도 숨긴다.
    await expect(
      page.getByRole("link", { name: "전체보기" }).filter({ visible: true }),
    ).toHaveCount(0);
  });
});
