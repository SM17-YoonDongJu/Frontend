import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * 고객 리포트 상세 E2E (이슈 #65 모바일 반응형 + 데스크톱 회귀).
 *
 * 원칙: 사용자 행동 기준 — 모바일 스모크(히어로 예상범위·검수 배너·연결 CTA), 쟁점/근거 접이식 펼침,
 * 사정사 조회 시 연결 CTA·사정사 카드 부재, 데스크톱 룩 회귀.
 * 응답은 기본 MSW 핸들러(test-id-123 = 검수완료 샘플)가 제공.
 * 사정사 케이스만 localStorage["mock:userType"]="adjuster"로 /users/me 응답을 override(핸들러 지원).
 * 저가치 필드 형식(금액 단위·nullish)은 zod·TS 정적 레이어에 위임(미테스트).
 *
 * 뷰포트는 프로젝트 device와 무관하게 각 describe에서 명시 고정(모바일 454px / 데스크톱 1280px)해
 * chromium·mobile-chrome·mobile-safari 3개 프로젝트에서 동일하게 통과하도록 한다.
 */

const PATH = "/customer/report/test-id-123";

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
});

test.describe("모바일 뷰(454px)", () => {
  test.use({ viewport: { width: 454, height: 900 } });

  test("리포트에 진입하면 히어로 예상범위·검수 배너·연결 CTA가 보인다", async ({ page }) => {
    await page.goto(PATH);

    // 모바일 back 바 타이틀
    await expect(page.getByRole("heading", { name: "분석 리포트" })).toBeVisible();

    // 판정 히어로: 검토 권장 배지 + 금액 범위
    await expect(page.getByText("검토 권장")).toBeVisible();
    await expect(page.getByText(/1,350\s*–\s*1,700/)).toBeVisible();

    // 검수 완료 배너
    await expect(page.getByRole("heading", { name: /검수해주셨어요/ })).toBeVisible();

    // 사정사 연결 CTA(링크형 버튼)
    await expect(page.getByRole("link", { name: /사정사님께 연결하기/ })).toBeVisible();

    // 면책 고지 상시 노출(컴플라이언스)
    await expect(page.getByText(/참고용 추정 분석/)).toBeVisible();
  });

  test("쟁점을 누르면 근거 태그가 펼쳐진다", async ({ page }) => {
    await page.goto(PATH);

    const issue = page.getByRole("listitem").filter({ hasText: "장해등급 과소 산정 가능" });
    const tag = issue.getByText("분쟁조정 2023-1456");

    // 접힘 기본: 태그 숨김
    await expect(tag).toBeHidden();

    await expect(async () => {
      await issue.getByRole("button").click();
      await expect(issue.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    }).toPass({ timeout: 10000 });

    await expect(tag).toBeVisible();
  });

  test("근거 약관·판례를 누르면 항목이 펼쳐진다", async ({ page }) => {
    await page.goto(PATH);

    const toggle = page.getByRole("button", { name: "근거 약관 · 판례" });
    const item = page.getByText(/후유장해 보험금 산정기준/);

    await expect(item).toBeHidden();

    await expect(async () => {
      await toggle.click();
      await expect(toggle).toHaveAttribute("aria-expanded", "true");
    }).toPass({ timeout: 10000 });

    await expect(item).toBeVisible();
  });
});

test.describe("사정사 조회(454px)", () => {
  test.use({ viewport: { width: 454, height: 900 } });

  test("사정사로 조회하면 연결 CTA와 사정사 카드가 없다", async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("mock:userType", "adjuster");
    });
    await page.goto(PATH);

    // 본문은 정상 노출
    await expect(page.getByText("검토 권장")).toBeVisible();

    // 연결 CTA·사정사 카드 부재
    await expect(page.getByRole("link", { name: /연결하기/ })).toHaveCount(0);
    await expect(page.getByText("이 리포트를 검수한 전문가")).toHaveCount(0);

    // 면책 고지는 역할 무관 유지
    await expect(page.getByText(/참고용 추정 분석/)).toBeVisible();
  });
});

test.describe("데스크톱 뷰(1280px)", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("리포트에 진입하면 검수 결과 핵심 정보가 보인다", async ({ page }) => {
    await page.goto(PATH);

    await expect(page.getByRole("heading", { name: "보험 보상 분석 리포트" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "정우성 손해사정사의 검수 의견" }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "검토가 필요한 쟁점" })).toBeVisible();
    await expect(page.getByText("외모추상 특약 청구 누락")).toBeVisible();
    await expect(page.getByRole("heading", { name: "적용 가능 보장 항목" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "누락 가능 특약" })).toBeVisible();
    await expect(page.getByRole("link", { name: "이 의견으로 상담하기" })).toBeVisible();
  });

  test("PDF 저장을 누르면 리포트가 PDF로 다운로드된다", async ({ page }) => {
    await page.goto(PATH);
    await expect(page.getByRole("heading", { name: "보험 보상 분석 리포트" })).toBeVisible();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "PDF 저장" }).click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });
});
