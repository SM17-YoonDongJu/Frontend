import { expect, test } from "@playwright/test";

/**
 * 손해사정사 찾기 E2E (happy-path + 필터, 이슈 #47).
 *
 * 원칙: 핵심 사용자 흐름만 — 목록 열람 / 전문분야 필터 / 정렬 / 검색 미스 빈 상태 / 상담·프로필 이동 / 모바일 반응형.
 * 응답은 기본 MSW 핸들러(GET /adjusters)가 제공(목 6명, meta 통계, keyword·specialty·region·sort 필터·정렬).
 * 필터/정렬 변경은 Suspense 재진입(스켈레톤)을 유발하므로 web-first 단언의 자동 재시도로 흡수한다.
 *
 * 정적 위임(미테스트): 필드 형식·shape은 zod(adjuster-list.schema)·TS가 강제.
 * 보류: x-mock-failure 에러 상태 — 아래 test.fixme 참고(트리거 수단 부재).
 */

const PATH = "/customer/adjusters";
const MOBILE = { width: 390, height: 844 };

test("진입하면 헤딩·통계 밴드·카드 6장이 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(
    page.getByRole("heading", { level: 1, name: /손해사정사 검색/ }),
  ).toBeVisible();

  // PC 통계 밴드(meta)
  await expect(page.getByText("검증 손해사정사")).toBeVisible();
  await expect(page.getByText("평균 경력")).toBeVisible();

  await expect(page.getByRole("article")).toHaveCount(6);
  await expect(page.getByText("6명의 손해사정사")).toBeVisible();
});

test("전문분야 필터를 고르면 목록이 해당 분야로 좁혀진다", async ({ page }) => {
  await page.goto(PATH);

  // 렌더·데이터 로드 확인(하이드레이션 proxy)
  await expect(page.getByRole("article")).toHaveCount(6);

  // 사이드바 전문분야 버튼(라벨+카운트 → 정규식 부분매칭)
  await page.getByRole("button", { name: /후유장해/ }).click();

  // 후유장해 보유: 정우성·윤지후·한도윤 = 3명
  await expect(page.getByRole("article")).toHaveCount(3);
  await expect(page.getByRole("article").filter({ hasText: "정우성 사정사" })).toBeVisible();
  await expect(page.getByRole("article").filter({ hasText: "박준호 사정사" })).toHaveCount(0);
});

test("경력순으로 정렬하면 최고 경력 사정사가 첫 카드에 온다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("article")).toHaveCount(6);

  await page.getByRole("radio", { name: "경력순" }).click();

  // career: 정우성 18 > 윤지후 15 > 이서연 12 ... → 첫 카드=정우성
  await expect(page.getByRole("article").first()).toContainText("정우성 사정사");
});

test("검색에 안 맞는 키워드를 넣으면 빈 상태 안내가 보인다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("article")).toHaveCount(6);

  const search = page.getByLabel("손해사정사 검색");
  await search.fill("존재하지않는키워드zzz");

  await expect(async () => {
    await search.press("Enter");
    await expect(page.getByText("검색 조건에 맞는 손해사정사가 없어요")).toBeVisible();
  }).toPass({ timeout: 10000 });

  await expect(page.getByRole("article")).toHaveCount(0);
});

test("상담 신청을 누르면 채팅 화면으로 이동한다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("article")).toHaveCount(6);

  await expect(async () => {
    await page.getByRole("link", { name: /상담 신청/ }).first().click();
    await expect(page).toHaveURL(/\/customer\/chat\?adjusterId=[0-9a-f-]+/);
  }).toPass({ timeout: 10000 });
});

test("프로필을 누르면 해당 사정사 상세로 이동한다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("article")).toHaveCount(6);

  await expect(async () => {
    await page.getByRole("link", { name: "프로필" }).first().click();
    await expect(page).toHaveURL(
      /\/customer\/adjusters\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/,
    );
  }).toPass({ timeout: 10000 });
});

test("모바일에서는 필터 칩이 보이고 사이드바는 숨는다", async ({ page }) => {
  await page.setViewportSize(MOBILE);
  await page.goto(PATH);

  await expect(
    page.getByRole("heading", { level: 1, name: /손해사정사 찾기/ }),
  ).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(6);

  // 사이드바(aside=complementary) 숨김, 필터 칩 노출
  await expect(page.getByRole("complementary")).toBeHidden();
  const chip = page.getByRole("button", { name: "후유장해" });
  await expect(chip).toBeVisible();

  // 칩 탭 → 후유장해 3명으로 필터링
  await chip.click();
  await expect(page.getByRole("article")).toHaveCount(3);
  await expect(page.getByRole("article").filter({ hasText: "박준호 사정사" })).toHaveCount(0);
});

/**
 * 보류: 에러 상태(GET /adjusters 500) E2E.
 * 사유: MSW 핸들러가 에러를 `x-mock-failure: adjusters` 요청 헤더로만 트리거하는데,
 *   앱 fetchJson은 이 헤더를 보내지 않고, 프로필 스펙처럼 URL/고정ID 기반 트리거도 없다.
 *   MSW 서비스워커가 Playwright network layer보다 먼저 fetch를 가로채므로 page.route로
 *   헤더를 주입해도 MSW엔 닿지 않는다(결정적 트리거 수단 부재).
 * 대안(리더/데이터엔지니어 판단): 핸들러에 URL 쿼리(예: ?keyword=__error__) 트리거를 추가하거나,
 *   프로필 에러 플로우와 동일하게 고정 트리거를 두면 override 없이 E2E로 승격 가능.
 * 검증 시나리오: 500 응답 시 "손해사정사 목록을 불러오지 못했어요" + [다시 시도] 노출, 재시도 시 복구.
 */
test.fixme("서버 오류 시 에러 안내와 재시도가 보인다(트리거 수단 부재로 보류)", async () => {});
