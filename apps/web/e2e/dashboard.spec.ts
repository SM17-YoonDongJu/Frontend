import { expect, test } from "@playwright/test";

/**
 * 고객 홈 대시보드 개편 E2E — 데스크톱 (이슈 #142).
 *
 * 원칙: 사용자 행동 기준 핵심 흐름만 — 대시보드 4상태(온보딩·제안 도착·검수 중·전부 종료)의
 *   섹션 노출/숨김과 주요 진입 이동. 구현 셀렉터(클래스·컴포넌트명) 금지, 역할·텍스트만.
 * 상태 주입: MSW x-mock-scenario 헤더(page.route는 MSW 서비스워커가 가로채 무효 — 기존
 *   대시보드/리포트 스펙 관례). 기본(헤더 없음)=제안 도착. useMe(윤서)·GET /reports 2건은 기본 핸들러.
 * 정적 위임(미테스트): 필드 형식·nullable·금액 포맷은 zod·TS. 저가치 부제 라벨 근사는 미테스트.
 * 데스크톱·모바일 트리가 DOM에 hidden 공존하므로 visible 노드만 단언. <md 모바일 트리는 dashboard-mobile.spec.ts.
 */

const PATH = "/customer/dashboard";

test.use({ viewport: { width: 1280, height: 900 } });

test("온보딩: 리포트 0건이면 온보딩 구성이 보이고 첫 분석 시작이 분석 신청으로 이동한다", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "dashboard-onboarding" });
  await page.goto(PATH);

  // 온보딩 히어로 — 환영 칩 + 헤드라인 (이원 트리 hidden 공존 방어로 visible 한정)
  await expect(
    page.getByText("첫 방문을 환영해요, 윤서님").filter({ visible: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /제대로 받고 계신가요/ }).filter({ visible: true }),
  ).toBeVisible();
  // 사정사 소개 섹션(온보딩 전용 구성)
  await expect(
    page.getByRole("heading", { name: "어떤 사정사가 함께하나요?" }).filter({ visible: true }),
  ).toBeVisible();

  // CTA "5분 만에 첫 분석 시작" → 분석 신청 퍼널
  await expect(async () => {
    await page.getByRole("link", { name: "5분 만에 첫 분석 시작" }).filter({ visible: true }).click();
    await expect(page).toHaveURL(/\/customer\/adjust-request/);
  }).toPass({ timeout: 10000 });
});

test("제안 도착: 액션센터 새 제안 3건과 제안 비교 카드가 보이고 비교하기가 받은 제안 목록으로 이동한다", async ({
  page,
}) => {
  await page.goto(PATH);

  // 액션센터 "지금 할 일" — 메인 투두는 새 제안 3건
  await expect(
    page
      .getByRole("heading", { name: /새 제안 3건이 도착했어요/ })
      .filter({ visible: true }),
  ).toBeVisible();

  // 받은 제안 비교 카드
  await expect(
    page.getByRole("heading", { name: "받은 제안 비교" }).filter({ visible: true }),
  ).toBeVisible();

  // "제안 3건 비교하기" → 받은 제안 목록(/customer/proposals)
  await expect(async () => {
    await page
      .getByRole("link", { name: "제안 3건 비교하기" })
      .filter({ visible: true })
      .click();
    await expect(page).toHaveURL(/\/customer\/proposals$/);
  }).toPass({ timeout: 10000 });
});

test("검수 중: 제안이 없으면 제안 비교 카드가 없고 진행 중인 분석과 내 리포트가 보인다", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "dashboard-inspecting" });
  await page.goto(PATH);

  // 진행 중인 분석 타임라인 노출(activeReport 존재)
  await expect(
    page.getByRole("heading", { name: "진행 중인 분석" }).filter({ visible: true }),
  ).toBeVisible();

  // 제안 비교 카드 없음(proposalSummary null → 컴포넌트 null 반환, DOM 전무)
  await expect(
    page.getByRole("heading", { name: "받은 제안 비교" }),
  ).toHaveCount(0);

  // 타임라인 아래 내 분석 리포트 섹션
  await expect(
    page.getByRole("heading", { name: "내 분석 리포트" }).filter({ visible: true }),
  ).toBeVisible();
});

test("전부 종료: 진행 중 분석·제안이 없으면 타임라인·제안 비교가 없고 리포트 목록이 보인다", async ({
  page,
}) => {
  await page.setExtraHTTPHeaders({ "x-mock-scenario": "dashboard-closed" });
  await page.goto(PATH);

  await expect(
    page.getByRole("heading", { name: "진행 중인 분석" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "받은 제안 비교" }),
  ).toHaveCount(0);

  await expect(
    page.getByRole("heading", { name: "내 분석 리포트" }).filter({ visible: true }),
  ).toBeVisible();
});
