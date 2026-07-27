import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * 손해사정사 공개 프로필 E2E (happy-path, 이슈 #32).
 *
 * 원칙: 핵심 사용자 흐름만 — 프로필 전 영역 열람 / 통계·후기 표시 / 상담 신청 이동.
 * 응답은 기본 MSW 핸들러(GET /adjusters/:adjusterId)가 제공.
 * 빈 후기·404 분기는 고정 id 핸들러로 검증.
 */

const ADJUSTER_ID = "11111111-1111-4111-8111-111111111111";
const PATH = `/customer/adjusters/${ADJUSTER_ID}`;
const EMPTY_REVIEWS_ID = "00000000-0000-4000-8000-000000000000";
const NOT_FOUND_ID = "99999999-9999-4999-8999-999999999999";

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
});

test("진입하면 프로필 모든 영역이 보인다", async ({ page, isMobile }) => {
  await page.goto(PATH);

  await expect(
    page.getByRole("heading", { level: 1, name: /김도현 손해사정사/ }),
  ).toBeVisible();

  // 영역별 헤딩
  for (const section of ["소개", "전문 분야", "주요 경력", "의뢰인 후기", "상담 안내", "인증 정보"]) {
    await expect(page.getByRole("heading", { name: section })).toBeVisible();
  }

  // 통계 — 데스크톱은 3열 지표(처리 사건 포함), 모바일은 2셀 지표 스트립
  await expect(page.getByText("240+").filter({ visible: true })).toBeVisible();
  if (isMobile) {
    await expect(page.getByText("인증", { exact: true })).toBeVisible();
  } else {
    await expect(page.getByText("510건")).toBeVisible();
    await expect(page.getByText("자격 인증")).toBeVisible();
  }
});

test("후기가 최신순으로 정렬돼 보인다", async ({ page }) => {
  await page.goto(PATH);

  const reviewItems = page
    .getByRole("heading", { name: "의뢰인 후기" })
    .locator("xpath=ancestor::section")
    .getByRole("listitem");

  await expect(reviewItems.first()).toContainText("윤O서"); // 2026.05 (최신)
  await expect(reviewItems.nth(1)).toContainText("이O준"); // 2026.04
});

test("상담 신청을 누르면 채팅 화면으로 이동한다", async ({ page }) => {
  await page.goto(PATH);

  await expect(async () => {
    await page.getByRole("button", { name: "상담 신청" }).click();
    await expect(page).toHaveURL(/\/customer\/chat\?adjusterId=/);
  }).toPass({ timeout: 10000 });
});

test("후기가 없으면 빈 상태 안내가 보인다", async ({ page }) => {
  await page.goto(`/customer/adjusters/${EMPTY_REVIEWS_ID}`);

  await expect(page.getByText("아직 등록된 후기가 없습니다.")).toBeVisible();
});

test("없는 손해사정사는 에러 안내가 보인다", async ({ page }) => {
  await page.goto(`/customer/adjusters/${NOT_FOUND_ID}`);

  await expect(page.getByText("손해사정사를 찾을 수 없어요")).toBeVisible();
});

test.describe("모바일 뷰포트 (이슈 #64)", () => {
  test.use({ viewport: { width: 402, height: 874 } });

  test("앱바와 하단 고정 상담 신청 CTA가 보인다", async ({ page }) => {
    await page.goto(PATH);

    await expect(page.getByText("손해사정사 프로필")).toBeVisible();
    await expect(page.getByRole("button", { name: "뒤로 가기" })).toBeVisible();

    const cta = page.getByRole("button", { name: "상담 신청" });
    await expect(cta).toBeVisible();
    await page.evaluate(() => window.scrollBy(0, 1500));
    await expect(cta).toBeVisible();

    await expect(async () => {
      await cta.click();
      await expect(page).toHaveURL(/\/customer\/chat\?adjusterId=/);
    }).toPass({ timeout: 10000 });
  });

  test("지표 스트립의 평점을 누르면 후기 섹션으로 스크롤된다", async ({ page }) => {
    await page.goto(PATH);

    await page.getByRole("button", { name: /평점/ }).click();

    await expect(async () => {
      const reviews = page.getByRole("heading", { name: "의뢰인 후기" });
      await expect(reviews).toBeInViewport();
    }).toPass({ timeout: 10000 });
  });

  test("소개가 길면 더보기로 접혀 있고 눌러 펼칠 수 있다", async ({ page }) => {
    await page.goto(PATH);

    const toggle = page.getByRole("button", { name: "더보기" });
    await expect(toggle).toBeVisible();

    await toggle.click();
    await expect(page.getByRole("button", { name: "접기" })).toBeVisible();
    await expect(page.getByText("모든 판단의 근거를 함께 설명드립니다", { exact: false })).toBeVisible();
  });
});
