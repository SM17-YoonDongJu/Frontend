import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * 검수 대기 리스트 E2E — 핵심 흐름 (이슈 #62 모바일 + #94 status 탭·PC 레이아웃).
 *
 * 원칙: 핵심 사용자 흐름만 — 목록 진입 열람 / 유형 칩·status 탭 필터링(URL 동기화) / 검수 진입 /
 *   "더보기"로 다음 페이지 이어 보기 / 지역 필터 / 헤더 "진행 중" 이동(#326).
 * 응답은 기본 MSW 핸들러가 제공한다. 실서버 목록은 검수 단계 리포트만 돌려주므로 시드도
 *   전체 6 · 전송 완료 2다(상담 전환·미채택·종결은 이 목록에 나오지 않는다).
 * 페이지 분할은 x-mock-scenario: pending-review-many(25건, 한 페이지 20건)로 재현한다 —
 *   MSW는 서비스워커라 page.route를 못 써서 fetch를 감싸 헤더를 싣는다.
 * 페이지가 모바일(md 미만)·데스크톱 두 레이아웃을 함께 렌더하므로, 텍스트 매칭은 보이는 쪽만
 *   잡도록 visible 필터를 쓴다(role 셀렉터는 접근성 트리 기준이라 숨김 뷰를 스스로 배제).
 * 빈 상태(list:[])·403 FORBIDDEN 화면은 MSW 핸들러 override 경로 부재로 실행 보류(04_qa 참조).
 */

const PATH = "/partner/review";

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "CERTIFICATED_ADJUSTER");
});

function visibleText(page: Page, text: string): Locator {
  return page.getByText(text).filter({ visible: true });
}

test("검수 대기 페이지에 진입하면 헤더와 사건 카드가 보인다", async ({ page, isMobile }) => {
  await page.goto(PATH);

  await expect(page.getByRole("heading", { name: "검수 대기" }).first()).toBeVisible();
  if (isMobile) {
    await expect(visibleText(page, "매칭 높은 순으로 정렬했어요.")).toBeVisible();
  } else {
    await expect(visibleText(page, "AI가 작성한 초안을 골라 검토하고, 의뢰를 수락하세요.")).toBeVisible();
  }
  await expect(visibleText(page, "우측 슬관절 인대 파열 · 등급 재산정")).toBeVisible();
});

test("후유장해 칩을 선택하면 URL에 type이 붙고 해당 유형만 남는다", async ({ page }) => {
  await page.goto(PATH);

  // 필터 전: 교통사고 카드가 보인다
  await expect(visibleText(page, "다발성 늑골 골절 · 일실수입 과소")).toBeVisible();

  await expect(async () => {
    await page.getByRole("button", { name: "후유장해", exact: true }).click();
    await expect(page).toHaveURL(/[?&]type=disability/);
  }).toPass({ timeout: 10000 });

  // 필터 후: 후유장해 카드는 남고 교통사고 카드는 사라진다
  await expect(visibleText(page, "우측 슬관절 인대 파열 · 등급 재산정")).toBeVisible();
  await expect(page.getByText("다발성 늑골 골절 · 일실수입 과소")).toHaveCount(0);
});

test("전체 칩으로 되돌리면 type 파라미터가 사라지고 모든 유형이 보인다", async ({ page }) => {
  await page.goto(`${PATH}?type=disability`);

  await expect(page.getByText("다발성 늑골 골절 · 일실수입 과소")).toHaveCount(0);

  await expect(async () => {
    await page.getByRole("button", { name: "전체", exact: true }).click();
    await expect(page).toHaveURL(/\/partner\/review$/);
  }).toPass({ timeout: 10000 });

  await expect(visibleText(page, "다발성 늑골 골절 · 일실수입 과소")).toBeVisible();
});

test("모바일 카드의 검수 버튼을 누르면 검수 상세로 이동한다", async ({ page, isMobile }) => {
  test.skip(!isMobile, "모바일 카드 전용 흐름 — 데스크톱은 프리뷰 패널의 검수 시작으로 진입");
  await page.goto(PATH);

  const card = page
    .getByRole("listitem")
    .filter({ hasText: "우측 슬관절 인대 파열 · 등급 재산정" });

  await expect(async () => {
    await card.getByRole("link", { name: /검수/ }).click();
    await expect(page).toHaveURL(/\/partner\/review\/[0-9a-f-]{36}/);
  }).toPass({ timeout: 10000 });
});

/**
 * status 필터 탭바 (이슈 #94).
 */

test("status 탭바에는 목록에 실제로 나오는 상태만 있다", async ({ page }) => {
  await page.goto(PATH);

  await expect(page.getByRole("tab", { name: "전체", exact: true })).toBeVisible();
  await expect(page.getByRole("tab", { name: "전송 완료", exact: true })).toBeVisible();

  // 이 목록에는 나오지 않는 상태는 늘 빈 목록이라 탭을 두지 않는다
  await expect(page.getByRole("tab", { name: /상담 전환/ })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: /미채택/ })).toHaveCount(0);
  await expect(page.getByRole("tab", { name: /종결/ })).toHaveCount(0);
});

test("전송 완료 탭을 선택하면 URL에 status가 붙고 해당 상태만 남는다", async ({ page }) => {
  await page.goto(PATH);

  await expect(visibleText(page, "우측 슬관절 인대 파열 · 등급 재산정")).toBeVisible();

  await expect(async () => {
    await page.getByRole("tab", { name: /전송 완료/ }).click();
    await expect(page).toHaveURL(/[?&]status=AWAITING_ADOPTION/);
  }).toPass({ timeout: 10000 });

  await expect(visibleText(page, "경추 염좌 · 향후 치료비 미반영")).toBeVisible();
  await expect(page.getByText("우측 슬관절 인대 파열 · 등급 재산정")).toHaveCount(0);
});

test("전체 탭으로 되돌리면 status 파라미터가 사라지고 모든 상태가 보인다", async ({ page }) => {
  await page.goto(`${PATH}?status=AWAITING_ADOPTION`);

  await expect(visibleText(page, "경추 염좌 · 향후 치료비 미반영")).toBeVisible();
  await expect(page.getByText("우측 슬관절 인대 파열 · 등급 재산정")).toHaveCount(0);

  await expect(async () => {
    await page.getByRole("tab", { name: /^전체/ }).click();
    await expect(page).toHaveURL(/\/partner\/review$/);
  }).toPass({ timeout: 10000 });

  await expect(visibleText(page, "우측 슬관절 인대 파열 · 등급 재산정")).toBeVisible();
});

test("status 탭과 유형 칩 필터가 함께 적용된다", async ({ page }) => {
  await page.goto(PATH);

  await expect(async () => {
    await page.getByRole("tab", { name: /전송 완료/ }).click();
    await expect(page).toHaveURL(/[?&]status=AWAITING_ADOPTION/);
  }).toPass({ timeout: 10000 });

  await expect(async () => {
    await page.getByRole("button", { name: "후유장해", exact: true }).click();
    await expect(page).toHaveURL(/[?&]type=disability/);
  }).toPass({ timeout: 10000 });

  await expect(visibleText(page, "견관절 회전근개 파열 · 등급 재산정")).toBeVisible();
  await expect(page.getByText("경추 염좌 · 향후 치료비 미반영")).toHaveCount(0);
});

test("결과 없는 status·유형 조합이면 빈 상태가 보인다", async ({ page }) => {
  await page.goto(`${PATH}?status=AWAITING_ADOPTION&type=medical_indemnity`);

  await expect(visibleText(page, "전송 완료 실손 케이스가 없어요")).toBeVisible();
  await expect(
    visibleText(page, "다른 상태나 유형을 선택하거나 잠시 후 다시 확인해 주세요."),
  ).toBeVisible();
});

/**
 * 헤더 "진행 중" (이슈 #215 → #326) — 데스크톱 내비게이션 전용.
 * 검수 대기 목록은 내가 제안을 보낸 건을 돌려주지 않아 거기서 "진행 중"을 만들 수 없다.
 * 내 검수 진행 상황이 있는 검수 내역으로 연결한다.
 */

test("헤더 진행 중을 누르면 검수 내역으로 이동한다", async ({ page, isMobile }) => {
  test.skip(isMobile, "헤더 내비게이션은 데스크톱(md 이상) 전용");
  await page.goto("/partner");

  await expect(async () => {
    await page.getByRole("link", { name: "진행 중" }).click();
    await expect(page).toHaveURL(/\/partner\/mypage\/review-history$/);
  }).toPass({ timeout: 10000 });

  await expect(page.getByRole("heading", { name: "검수 내역" })).toBeVisible();
});

/**
 * PC 레이아웃 (이슈 #94) — 요약 카드·프리뷰 패널·보류.
 */

test("데스크톱에서 요약 카드와 프리뷰 패널이 보인다", async ({ page, isMobile }) => {
  test.skip(isMobile, "데스크톱 전용 레이아웃");
  await page.goto(PATH);

  await expect(visibleText(page, "진행 중 검수")).toBeVisible();
  await expect(visibleText(page, "오늘 마감 임박")).toBeVisible();

  // 첫 카드가 기본 선택되어 프리뷰 패널이 채워진다
  await expect(visibleText(page, "검토 가능한 예상 보상 범위")).toBeVisible();
  await expect(visibleText(page, "미리보기 중")).toBeVisible();
  await expect(page.getByRole("button", { name: /검수 시작/ })).toBeVisible();
});

test("데스크톱에서 카드를 선택하면 프리뷰 패널로 검수 상세에 진입한다", async ({ page, isMobile }) => {
  test.skip(isMobile, "데스크톱 전용 프리뷰 패널");
  await page.goto(PATH);

  const secondCard = page
    .getByRole("button")
    .filter({ hasText: "다발성 늑골 골절 · 일실수입 과소" });
  await expect(async () => {
    await secondCard.click();
    await expect(secondCard.getByText("미리보기 중")).toBeVisible();
  }).toPass({ timeout: 10000 });

  await expect(async () => {
    await page.getByRole("button", { name: /검수 시작/ }).click();
    await expect(page).toHaveURL(/\/partner\/review\/[0-9a-f-]{36}/);
  }).toPass({ timeout: 10000 });
});

test("데스크톱에서 보류 사유를 선택하면 카드가 보류 상태로 바뀐다", async ({ page, isMobile }) => {
  test.skip(isMobile, "데스크톱 전용 보류 동작");
  await page.goto(PATH);

  await expect(visibleText(page, "미리보기 중")).toBeVisible();

  // 프리뷰 패널의 보류 → 사유 선택 다이얼로그
  await page.getByRole("button", { name: "보류", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "검수 보류 사유 선택" });
  await expect(dialog).toBeVisible();

  await dialog.getByRole("button", { name: "자료 보완 필요" }).click();

  await expect(
    page
      .getByRole("listitem")
      .filter({ hasText: "우측 슬관절 인대 파열 · 등급 재산정" })
      .getByText("보류"),
  ).toBeVisible({ timeout: 10000 });
});

/**
 * 목록 이어 보기·지역 필터 (이슈 #326).
 */

test("목록이 한 페이지를 넘으면 더보기로 다음 페이지가 이어서 보인다", async ({ page }) => {
  await page.addInitScript(() => {
    const originalFetch = window.fetch;
    window.fetch = (input, init = {}) => {
      const headers = new Headers(init.headers);
      headers.set("x-mock-scenario", "pending-review-many");
      return originalFetch(input, { ...init, headers });
    };
  });
  await page.goto(PATH);

  // 첫 페이지(20건)까지만 보인다 — 21번째 건은 아직 없다
  await expect(visibleText(page, "검수 대기 사건 01")).toBeVisible();
  await expect(visibleText(page, "검수 대기 사건 20")).toBeVisible();
  await expect(page.getByText("검수 대기 사건 21")).toHaveCount(0);

  const loadMore = page.getByRole("button", { name: "더보기" });
  await expect(async () => {
    await loadMore.click();
    await expect(visibleText(page, "검수 대기 사건 25")).toBeVisible({ timeout: 3000 });
  }).toPass({ timeout: 15000 });

  // 앞 페이지 건도 그대로 남고, 마지막 페이지라 더보기는 사라진다
  await expect(visibleText(page, "검수 대기 사건 01")).toBeVisible();
  await expect(loadMore).toHaveCount(0);
});

test("한 페이지에 다 담기는 목록에는 더보기가 없다", async ({ page }) => {
  await page.goto(PATH);

  await expect(visibleText(page, "우측 슬관절 인대 파열 · 등급 재산정")).toBeVisible();
  await expect(page.getByRole("button", { name: "더보기" })).toHaveCount(0);
});

test("지역을 고르면 그 지역이 포함된 건만 남고 URL에 region이 붙는다", async ({ page, isMobile }) => {
  test.skip(isMobile, "지역 필터는 데스크톱 필터바 전용");
  await page.goto(PATH);

  await expect(visibleText(page, "경추 염좌 · 향후 치료비 미반영")).toBeVisible();

  // 지역이 여럿인 건("서울 강남구 · 서울 서초구")은 각 지역으로 모두 걸린다
  await expect(async () => {
    await page.getByLabel("지역 필터").selectOption("서울 서초구");
    await expect(page).toHaveURL(/[?&]region=/);
  }).toPass({ timeout: 10000 });

  await expect(visibleText(page, "우측 슬관절 인대 파열 · 등급 재산정")).toBeVisible();
  // 모바일 트리는 지역 필터가 없어 숨김 상태로 전체를 들고 있다 — 보이는 목록만 판정한다
  await expect(visibleText(page, "경추 염좌 · 향후 치료비 미반영")).toHaveCount(0);
  await expect(visibleText(page, "다발성 늑골 골절 · 일실수입 과소")).toHaveCount(0);
});

test("첫 페이지에 없는 지역도 지역 필터에서 고를 수 있다", async ({ page, isMobile }) => {
  test.skip(isMobile, "지역 필터는 데스크톱 필터바 전용");
  await page.goto(PATH);

  // 시드 목록에 한 건도 없는 지역 — 받아 온 목록에서 옵션을 뽑으면 이 값은 없다
  await expect(page.getByLabel("지역 필터").locator("option", { hasText: "제주 제주시" })).toHaveCount(1);
});
