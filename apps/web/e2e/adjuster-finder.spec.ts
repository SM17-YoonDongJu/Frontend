import { expect, test } from "@playwright/test";

/**
 * 손해사정사 찾기 E2E (happy-path + 필터, 이슈 #47).
 *
 * 원칙: 핵심 사용자 흐름만 — 목록 열람 / 더보기 / 전문분야 필터 / 정렬 / 검색 미스 빈 상태 / 상담·프로필 이동 / 모바일 반응형 / 서버 오류.
 * 응답은 기본 MSW 핸들러(GET /adjusters)가 제공(목 26명 = Figma 6 + 생성 20, 페이지 크기 20 → 2페이지).
 * 필터/정렬 변경은 Suspense 재진입(스켈레톤)을 유발하므로 web-first 단언의 자동 재시도로 흡수한다.
 * 서버 오류는 핸들러의 E2E 전용 트리거(검색어 "__error__")로 재현한다.
 *
 * 정적 위임(미테스트): 필드 형식·shape은 zod(adjuster-list.schema)·TS가 강제.
 */

const PATH = "/customer/adjusters";
const MOBILE = { width: 390, height: 844 };
const PAGE_SIZE = 20;
const TOTAL = 26;
const DISABILITY_COUNT = 7; // 후유장해 보유: 정우성·윤지후·한도윤 + 생성분 4명

// 이 파일 시나리오는 PC 레이아웃(h1 "검색"·통계 밴드·사이드바 정렬·프로필 링크) 기준.
// 모바일 프로젝트(Pixel 7 등)에서도 데스크톱 뷰포트로 고정해 돌리고,
// 모바일 레이아웃은 아래 "모바일에서는 필터 칩…" 테스트가 뷰포트를 직접 좁혀 검증한다.
test.use({ viewport: { width: 1280, height: 900 } });

test("진입하면 헤딩·통계 밴드·카드 한 페이지가 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(
    page.getByRole("heading", { level: 1, name: /손해사정사 검색/ }),
  ).toBeVisible();

  // PC 통계 밴드(meta)
  await expect(page.getByText("검증 손해사정사")).toBeVisible();
  await expect(page.getByText("평균 경력")).toBeVisible();

  await expect(page.getByRole("article")).toHaveCount(PAGE_SIZE);
  await expect(page.getByText(`${TOTAL}명의 손해사정사`)).toBeVisible();
});

test("더보기를 누르면 다음 페이지가 이어 붙고 버튼이 사라진다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("article")).toHaveCount(PAGE_SIZE);

  const more = page.getByRole("button", { name: "더보기" });
  await expect(more).toBeVisible();
  await more.click();

  await expect(page.getByRole("article")).toHaveCount(TOTAL);
  await expect(more).toBeHidden();
});

test("전문분야 필터를 고르면 목록이 해당 분야로 좁혀진다", async ({ page }) => {
  await page.goto(PATH);

  // 렌더·데이터 로드 확인(하이드레이션 proxy)
  await expect(page.getByRole("article")).toHaveCount(PAGE_SIZE);

  // 사이드바 전문분야 버튼(라벨+카운트 → 정규식 부분매칭)
  await page.getByRole("button", { name: /후유장해/ }).click();

  await expect(page.getByRole("article")).toHaveCount(DISABILITY_COUNT);
  await expect(page.getByRole("article").filter({ hasText: "정우성 사정사" })).toBeVisible();
  await expect(page.getByRole("article").filter({ hasText: "박준호 사정사" })).toHaveCount(0);
});

test("경력순으로 정렬하면 최고 경력 사정사가 첫 카드에 온다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("article")).toHaveCount(PAGE_SIZE);

  await page.getByRole("radio", { name: "경력순" }).click();

  // career: 정우성 18이 목 전체 최고 → 첫 카드=정우성
  await expect(page.getByRole("article").first()).toContainText("정우성 사정사");
});

test("검색에 안 맞는 키워드를 넣으면 빈 상태 안내가 보인다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("article")).toHaveCount(PAGE_SIZE);

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
  await expect(page.getByRole("article")).toHaveCount(PAGE_SIZE);

  await expect(async () => {
    await page.getByRole("link", { name: /상담 신청/ }).first().click();
    await expect(page).toHaveURL(/\/customer\/chat\?adjusterId=[0-9a-f-]+/);
  }).toPass({ timeout: 10000 });
});

test("프로필을 누르면 해당 사정사 상세로 이동한다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("article")).toHaveCount(PAGE_SIZE);

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
  await expect(page.getByRole("article")).toHaveCount(PAGE_SIZE);

  // 사이드바(aside=complementary) 숨김, 필터 칩 노출
  await expect(page.getByRole("complementary")).toBeHidden();
  const chip = page.getByRole("button", { name: "후유장해" });
  await expect(chip).toBeVisible();

  // 칩 탭 → 후유장해 보유만 필터링
  await chip.click();
  await expect(page.getByRole("article")).toHaveCount(DISABILITY_COUNT);
  await expect(page.getByRole("article").filter({ hasText: "박준호 사정사" })).toHaveCount(0);
});

test("지역 버튼을 누르면 선택창이 열리고 바깥을 클릭하면 닫힌다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("article")).toHaveCount(PAGE_SIZE);

  const dropdown = page.getByRole("dialog", { name: "지역 선택" });
  await expect(dropdown).toBeHidden();

  await page.getByRole("button", { name: "지역", exact: true }).click();
  await expect(dropdown).toBeVisible();

  await page.getByRole("heading", { level: 1 }).click();
  await expect(dropdown).toBeHidden();
});

test("시·도를 고르면 시·군·구 목록으로 넘어가고 뒤로 돌아올 수 있다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("article")).toHaveCount(PAGE_SIZE);

  await page.getByRole("button", { name: "지역", exact: true }).click();
  const dropdown = page.getByRole("dialog", { name: "지역 선택" });

  await dropdown.getByRole("button", { name: "서울특별시" }).click();
  await expect(dropdown.getByText("시·군·구 선택")).toBeVisible();
  await expect(dropdown.getByRole("checkbox", { name: "강남구" })).toBeVisible();

  await dropdown.getByRole("button", { name: "서울특별시" }).click();
  await expect(dropdown.getByText("시·도 선택")).toBeVisible();
});

test("지역명을 검색하면 시·군·구 결과가 바로 나온다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("article")).toHaveCount(PAGE_SIZE);

  await page.getByRole("button", { name: "지역", exact: true }).click();
  const dropdown = page.getByRole("dialog", { name: "지역 선택" });

  await dropdown.getByLabel("지역 검색").fill("강남");

  await expect(dropdown.getByRole("checkbox", { name: "서울 강남구" })).toBeVisible();
  await expect(dropdown.getByRole("checkbox", { name: "서울 강북구" })).toHaveCount(0);
});

test("지역 두 곳을 골라 적용하면 해당 지역 사정사만 남는다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("article")).toHaveCount(PAGE_SIZE);

  await page.getByRole("button", { name: "지역", exact: true }).click();
  const dropdown = page.getByRole("dialog", { name: "지역 선택" });

  await dropdown.getByRole("button", { name: "서울특별시" }).click();
  await dropdown.getByText("강남구", { exact: true }).click();
  await dropdown.getByRole("button", { name: "서울특별시" }).click();

  await dropdown.getByRole("button", { name: "경기도" }).click();
  await dropdown.getByText("수원시", { exact: true }).click();

  await expect(dropdown.getByText("2곳 선택됨")).toBeVisible();
  await dropdown.getByRole("button", { name: "적용 (2)" }).click();

  // 트리거에 선택 결과 반영 + 목록은 두 지역 사정사만 (정우성=서울 강남구, 박준호=경기 수원시)
  await expect(page.getByRole("button", { name: /서울 강남구 외 1곳/ })).toBeVisible();
  await expect(page.getByRole("article")).toHaveCount(2);
  await expect(page.getByRole("article").filter({ hasText: "정우성 사정사" })).toBeVisible();
  await expect(page.getByRole("article").filter({ hasText: "박준호 사정사" })).toBeVisible();
});

test("서버 오류가 나면 에러 안내와 다시 시도가 보인다", async ({ page }) => {
  await page.goto(PATH);
  await expect(page.getByRole("article")).toHaveCount(PAGE_SIZE);

  // MSW 핸들러의 E2E 전용 실패 트리거 검색어
  const search = page.getByLabel("손해사정사 검색");
  await search.fill("__error__");

  await expect(async () => {
    await search.press("Enter");
    await expect(page.getByText("손해사정사 목록을 불러오지 못했어요")).toBeVisible();
  }).toPass({ timeout: 10000 });

  await expect(page.getByRole("button", { name: "다시 시도" })).toBeVisible();
});
