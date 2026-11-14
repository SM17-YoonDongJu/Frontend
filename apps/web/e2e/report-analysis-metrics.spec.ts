import { expect, test, type Locator, type Page } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * 리포트 신뢰도 사유·AI 분석 근거 패널 E2E (이슈 #324).
 *
 * 원칙: 사용자 행동 기준 — 리포트 상세에 들어가면 등급 문구 아래 신뢰도 사유가 보이고(모바일·데스크톱),
 * LOW 원인이 약관 데이터 공백이면 고객이 할 수 없는 자료 보강 권유가 사라진다.
 * "AI 분석 근거" 패널은 접힌 채로 오고 누르면 수치가 보인다. 수치가 늦거나 없거나 실패해도 상세 본문은 그대로.
 *
 * 응답은 앱 MSW 핸들러가 제공한다(헤더 없으면 high 픽스처 + 상세 HIGH).
 * 상태는 goto 전에 page.setExtraHTTPHeaders로 고른다:
 * - x-mock-metrics: 수치 픽스처 키. 상세 confidenceLevel도 같은 픽스처 등급으로 맞춰진다(같은 컬럼).
 * - x-mock-metrics-delay: infinite → 수치 응답 보류(로딩 고정).
 * - x-mock-failure: analysis-metrics(500) · analysis-metrics-missing(404 REPORT_NOT_FOUND).
 *
 * 등급 문구·사유 박스는 DOM에 모바일/데스크톱 두 벌(하나는 CSS hidden)이라 보이는 것만 찾는다.
 * 부재 단언(toHaveCount(0))은 "로딩 끝" 신호(토글·교체 문구·알림)를 먼저 확인한 뒤에 한다 —
 * 로딩 중엔 사유 박스·패널이 원래 없어서 거짓 통과한다.
 *
 * 정적 위임(의식적 미테스트):
 * - 등급 없음(UNKNOWN) + 사유만 있는 박스 — resolveConfidenceNote 순수 함수, 희귀 조합.
 * - 403 FORBIDDEN 페이지 — 404와 같은 경계 경로(throwOnError → ReportDetailBoundary), 코드 대조.
 * - 401 인증 계열 — 공용 client 담당(token-reissue·login-required 스펙).
 * - 재시도 횟수(1회)·staleTime(available이면 Infinity, 아니면 0)·gcTime — 훅 옵션 코드 대조.
 * - 포맷 경계값(1초 미만·정각 분·0~100% 자르기·모르는 문서 유형 합산) — _model 순수 함수.
 * - available인데 보여줄 줄이 0개면 LEGACY 문구로 대체 — 순수 함수 분기.
 * - 사정사 노출 — 공용 ReportDetailView라 역할 분기 없음(코드 대조).
 *
 * 뷰포트는 describe마다 고정(모바일 454px / 데스크톱 1280px) — chromium·mobile-chrome·mobile-safari 동일.
 */

// 검수 대기 리포트(report.spec.ts와 같은 uuid).
const PATH = "/customer/report/3f1c6a2e-9d84-4b17-8c55-2e7f0ab91d34";

const PANEL_TITLE = "AI 분석 근거";
const REASONS_TITLE = "신뢰도 사유";
const NOTE = {
  HIGH: "신뢰도 높음 — 현재 자료 기준 단계적으로 검토하는 보수적 범위입니다.",
  MEDIUM: "신뢰도 보통 — 추가 자료 확보 시 범위가 조정될 수 있어요.",
  LOW: "신뢰도 낮음 — 자료가 부족해 변동 폭이 커요. 자료 보강을 권해요.",
  LOW_TERMS_GAP: "신뢰도 낮음 — 약관 근거가 부족해 변동 폭이 커요.",
};
const LEGACY_NOTICE = "이 리포트에는 분석 근거 수치가 없어요";
const UNAVAILABLE_NOTICE = "지금은 분석 근거를 불러올 수 없어요";
// AI README 골든 예시 사유(서버 순서 그대로).
const MEDIUM_REASONS = [
  "가입금액 미보유 — 제시액 기준 어림 범위",
  "근거 미확인 주장 1건",
  "인용 검증 범위 일부(96%)",
  "근거에 없는 조항 인용 1건",
  "후유장해 지급률 추정 불확실",
];

type MetricsFixture =
  | "medium"
  | "low-terms"
  | "low-policy"
  | "low-range"
  | "null-mixed"
  | "no-draft"
  | "legacy"
  | "unavailable"
  | "unknown-reason"
  | "malformed";

/** 수치 픽스처를 고른다(상세 등급도 같이 맞춰진다). goto 전에 호출한다. */
async function mockMetrics(page: Page, fixture: MetricsFixture, extra: Record<string, string> = {}) {
  await page.setExtraHTTPHeaders({ "x-mock-metrics": fixture, ...extra });
}

/** 상세 본문(쟁점)이 그려졌다는 표지. */
function reportBody(page: Page) {
  return page.getByText("장해등급 과소 산정 가능");
}

/** 지금 뷰포트에서 보이는 문구만(등급 박스는 모바일/데스크톱 두 벌). */
function visibleText(page: Page, text: string | RegExp) {
  return page.getByText(text, { exact: typeof text === "string" }).filter({ visible: true });
}

/** 등급 문구 아래 사유 목록 — 숨은 쪽 벌은 접근성 트리에서 빠지므로 보이는 목록만 잡힌다. */
function reasonList(page: Page) {
  return page.getByRole("list", { name: REASONS_TITLE });
}

function panelToggle(page: Page) {
  return page.getByRole("button", { name: PANEL_TITLE, exact: true });
}

/** 패널을 펼친다 — 첫 클릭 유실 대비 재시도하되, 이미 펼쳐졌으면 다시 눌러 접지 않는다. */
async function openPanel(page: Page) {
  const toggle = panelToggle(page);
  await expect(async () => {
    if ((await toggle.getAttribute("aria-expanded")) !== "true") await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true", { timeout: 1000 });
  }).toPass({ timeout: 10000 });
  return page.getByRole("region", { name: PANEL_TITLE, exact: true });
}

/** 패널의 한 줄(라벨 정확 일치)에 값이 그대로 보인다. */
async function expectMetric(panel: Locator, label: string, value: string) {
  const row = panel
    .getByRole("listitem")
    .filter({ has: panel.page().getByText(label, { exact: true }) });
  await expect(row.getByText(value, { exact: true })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
});

test.describe("모바일 뷰(454px)", () => {
  test.use({ viewport: { width: 454, height: 900 } });

  test("수치가 있는 리포트에 들어가면 예상 범위 아래에 등급 문구와 신뢰도 사유가 보인다", async ({
    page,
  }) => {
    await mockMetrics(page, "medium");
    await page.goto(PATH);

    await expect(visibleText(page, NOTE.MEDIUM)).toBeVisible();
    await expect(reasonList(page)).toBeVisible();
    await expect(reasonList(page).getByRole("listitem")).toHaveText(MEDIUM_REASONS);
  });

  test("사유가 없는 리포트는 모바일에 신뢰도 박스가 없고, AI 분석 근거는 펼쳐 볼 수 있다", async ({
    page,
  }) => {
    await page.goto(PATH);

    // 로딩 끝(접힌 패널 도착) 뒤에 부재를 본다.
    await expect(panelToggle(page)).toBeVisible();
    await expect(reasonList(page)).toHaveCount(0);
    await expect(visibleText(page, /신뢰도 높음/)).toHaveCount(0);

    const panel = await openPanel(page);
    await expectMetric(panel, "문서 수", "4건");
    await expectMetric(panel, "분석 단계", "12단계");
  });
});

test.describe("데스크톱 뷰(1280px)", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("들어가면 기존 등급 문구와 게이지는 그대로이고, 접힌 AI 분석 근거를 누르면 수치가 보인다", async ({
    page,
  }) => {
    await page.goto(PATH);

    const toggle = panelToggle(page);
    await expect(toggle).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await expect(visibleText(page, NOTE.HIGH)).toBeVisible();
    await expect(page.getByText("분석 신뢰도", { exact: true })).toBeVisible();
    await expect(page.getByText("높음", { exact: true })).toBeVisible();
    await expect(reasonList(page)).toHaveCount(0);
    await expect(page.getByText("문서 유형", { exact: true })).toBeHidden();

    const panel = await openPanel(page);
    await expect(
      panel.getByText("AI가 이 리포트를 만들며 참고한 자료와 자체 점검 결과예요."),
    ).toBeVisible();
    await expect(panel.getByRole("heading", { level: 3 })).toHaveText([
      "입력",
      "검색 근거",
      "검증",
      "처리 경로",
    ]);
    await expectMetric(panel, "문서 유형", "보험증권 · 진단서 · 진료비 영수증 2건");
    await expectMetric(panel, "판례 검색 단계", "후보 12 → 중복 제거 9 → 관련 2 → 채택 2");
    await expectMetric(panel, "인용 조항", "3건 중 3건 근거 확인");
    await expectMetric(panel, "단계별 소요 시간 합계", "1분 13초");
  });

  test("사유가 있는 리포트는 등급 문구 아래 사유가 보이고, 패널에서 인용 검증 결과를 확인할 수 있다", async ({
    page,
  }) => {
    await mockMetrics(page, "medium");
    await page.goto(PATH);

    await expect(visibleText(page, NOTE.MEDIUM)).toBeVisible();
    await expect(reasonList(page).getByRole("listitem")).toHaveText(MEDIUM_REASONS);
    await expect(page.getByText("보통", { exact: true })).toBeVisible();

    const panel = await openPanel(page);
    await expectMetric(panel, "인용 조항", "3건 중 2건 근거 확인");
    await expectMetric(panel, "근거 미확인 조항", "제99조");
    await expectMetric(panel, "인용 검증 범위", "96%");
    // 후유장해 손상명(건강정보)은 어디에도 나오지 않는다.
    await expect(page.getByText(/추간판/)).toHaveCount(0);
  });

  for (const { fixture, reason } of [
    { fixture: "low-terms", reason: "약관 근거를 찾지 못함" },
    { fixture: "low-policy", reason: "가입 상품 약관이 DB에 없어 일반 약관으로 분석" },
  ] as const) {
    test(`LOW 원인이 약관 데이터 공백(${fixture})이면 자료 보강 권유 없이 약관 근거 부족 문구와 사유가 보인다`, async ({
      page,
    }) => {
      await mockMetrics(page, fixture);
      await page.goto(PATH);

      await expect(visibleText(page, NOTE.LOW_TERMS_GAP)).toBeVisible();
      await expect(page.getByText(/자료 보강을 권해요/)).toHaveCount(0);
      await expect(reasonList(page).getByText(reason, { exact: true })).toBeVisible();
      await expect(page.getByText("낮음", { exact: true })).toBeVisible();
    });
  }

  test("LOW 원인이 약관 공백이 아니면 기존 자료 보강 문구가 사유와 함께 보인다", async ({ page }) => {
    await mockMetrics(page, "low-range");
    await page.goto(PATH);

    await expect(visibleText(page, NOTE.LOW)).toBeVisible();
    await expect(
      reasonList(page).getByText("보상 범위 산출 불가(제시액·가입금액 없음)", { exact: true }),
    ).toBeVisible();
  });

  test("분석 근거가 늦게 와도 상세 본문과 게이지가 먼저 보이고, LOW 문구는 근거가 올 때까지 비워 둔다", async ({
    page,
  }) => {
    await mockMetrics(page, "low-terms", { "x-mock-metrics-delay": "infinite" });
    await page.goto(PATH);

    await expect(reportBody(page)).toBeVisible();
    await expect(page.getByRole("status", { name: "AI 분석 근거 불러오는 중" })).toBeVisible();
    await expect(page.getByText("낮음", { exact: true })).toBeVisible();
    // 수치가 아직 없으니 자료 보강 권유도, 교체 문구도 먼저 보이지 않는다.
    await expect(page.getByText(/신뢰도 낮음/)).toHaveCount(0);
  });

  test("분석 근거를 불러오지 못해도 상세 본문과 기존 등급 문구는 그대로 보인다", async ({ page }) => {
    await mockMetrics(page, "low-terms", { "x-mock-failure": "analysis-metrics" });
    await page.goto(PATH);

    // 서버 오류는 한 번 다시 시도한 뒤 안내로 바뀐다.
    await expect(page.getByText(UNAVAILABLE_NOTICE)).toBeVisible({ timeout: 10000 });
    await expect(reportBody(page)).toBeVisible();
    await expect(visibleText(page, NOTE.LOW)).toBeVisible();
    await expect(reasonList(page)).toHaveCount(0);
  });

  test("분석 초안이 없는 리포트는 AI 분석 근거 자리 없이 상세가 그대로 보인다", async ({ page }) => {
    await mockMetrics(page, "no-draft");
    await page.goto(PATH);

    await expect(reportBody(page)).toBeVisible();
    // 로딩 자리가 사라질 때까지 기다린 뒤 패널 부재를 본다.
    await expect(page.getByRole("status", { name: "AI 분석 근거 불러오는 중" })).toHaveCount(0);
    await expect(page.getByRole("region", { name: PANEL_TITLE })).toHaveCount(0);
    await expect(page.getByText(PANEL_TITLE, { exact: true })).toHaveCount(0);
    await expect(visibleText(page, NOTE.HIGH)).toBeVisible();
    await expect(page.getByRole("button", { name: "근거 약관 · 판례" })).toBeVisible();
  });

  test("수치가 없던 예전 리포트는 펼칠 수 없는 안내만 보인다", async ({ page }) => {
    await mockMetrics(page, "legacy");
    await page.goto(PATH);

    await expect(page.getByText(LEGACY_NOTICE)).toBeVisible();
    await expect(page.getByRole("heading", { name: PANEL_TITLE })).toBeVisible();
    await expect(panelToggle(page)).toHaveCount(0);
    await expect(reportBody(page)).toBeVisible();
  });

  for (const { fixture, situation } of [
    { fixture: "unavailable", situation: "수치를 만들지 못한 리포트" },
    { fixture: "unknown-reason", situation: "처음 보는 사유가 온 리포트" },
    { fixture: "malformed", situation: "계약과 다른 응답이 온 리포트" },
  ] as const) {
    test(`${situation}는 불러올 수 없다는 안내와 함께 상세 본문이 그대로 보인다(${fixture})`, async ({
      page,
    }) => {
      await mockMetrics(page, fixture);
      await page.goto(PATH);

      await expect(page.getByText(UNAVAILABLE_NOTICE)).toBeVisible();
      await expect(reportBody(page)).toBeVisible();
      await expect(visibleText(page, NOTE.HIGH)).toBeVisible();
    });
  }

  test("일부 수치가 비어 있어도 패널이 열리고 값이 있는 줄만 보인다", async ({ page }) => {
    await mockMetrics(page, "null-mixed");
    await page.goto(PATH);

    // 알림이 아니라 토글이 오면 응답 검증을 통과한 것이다.
    await expect(panelToggle(page)).toBeVisible();
    await expect(page.getByText(UNAVAILABLE_NOTICE)).toHaveCount(0);
    await expect(page.getByText(LEGACY_NOTICE)).toHaveCount(0);
    await expect(reasonList(page).getByRole("listitem")).toHaveText([
      "인용 검증 미수행",
      "일부 분석 단계 실패",
    ]);

    const panel = await openPanel(page);
    await expect(panel.getByRole("heading", { level: 3 })).toHaveText(["입력", "검증", "처리 경로"]);
    await expectMetric(panel, "문서 유형", "진단서 · 기타");
    await expectMetric(panel, "문서 인식 신뢰도", "평균 91%");
    await expectMetric(panel, "인용 검증 범위", "검증하지 않음");
    await expectMetric(panel, "분석 단계", "11단계 중 1단계 실패");
    await expect(panel.getByRole("heading", { name: "검색 근거", exact: true })).toHaveCount(0);
    for (const label of ["개인정보 가림", "인용 조항", "단계별 소요 시간 합계"]) {
      await expect(panel.getByText(label, { exact: true })).toHaveCount(0);
    }
  });

  test("분석 근거 조회에서 리포트가 없다고 하면 상세와 같은 안내 화면이 보인다", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-failure": "analysis-metrics-missing" });
    await page.goto(PATH);

    await expect(page.getByRole("heading", { name: "리포트를 찾을 수 없어요" })).toBeVisible();
    await expect(page.getByText("삭제되었거나 잘못된 주소예요.")).toBeVisible();
    await expect(reportBody(page)).toHaveCount(0);
  });
});
