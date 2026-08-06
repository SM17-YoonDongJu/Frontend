import { expect, test, type Page } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";
import { hideQueryDevtools, selectRegion } from "./_region-helpers";

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
  await hideQueryDevtools(page);
});

/**
 * 고객 마이페이지 「내 정보」 E2E (happy-path + 빈 상태 + 역할 게이팅, 이슈 #105 커밋 #19).
 *
 * 원칙: 핵심 사용자 흐름만 — 진입/프로필 수정 저장(PC 모달)/보험 목록·배지·추가/보험 0건 빈 상태/모바일 허브+바텀시트/파트너 전환 role 조건부.
 * 응답은 기본 MSW 핸들러가 제공(GET /users/me 윤서·role USER·phone 010-1234-5678, 활동카운트 3/2/1/4, 보험 2건, /reports 2건).
 * 고가치 override: 보험 0건은 x-mock-scenario 헤더, 파트너 전환 노출은 localStorage["mock:role"]=CERTIFICATED_ADJUSTER.
 * 필드 형식·범위(phone·nonnegative 카운트)·스테퍼 status→step 파생은 zod·TS에 위임(미테스트).
 *
 * 뷰포트 좌표: PC/모바일 두 트리가 DOM에 공존(hidden md:grid / md:hidden)하고, 프로필 수정 오버레이도
 * 모달·시트가 함께 마운트되므로 중복 텍스트는 .filter({ visible: true })로 보이는 노드만 지정한다.
 */

const PATH = "/customer/mypage";

test.describe("PC 내 정보 · 프로필 수정", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("진입하면 프로필 히어로와 사이드바 메뉴가 보인다", async ({ page }) => {
    await page.goto(PATH);

    await expect(page.getByRole("heading", { name: "윤서 님" })).toBeVisible();
    await expect(
      page.getByText("일반 회원").filter({ visible: true }),
    ).toBeVisible();
    // 사이드바 메뉴 + 강조 배지(받은 제안 proposalCount 2)
    await expect(
      page.getByRole("link", { name: /받은 제안/ }).filter({ visible: true }),
    ).toBeVisible();
  });

  test("프로필 수정을 열어 휴대폰을 바꿔 저장하면 연락처 카드에 반영된다", async ({
    page,
  }) => {
    await page.goto(PATH);

    // 하이드레이션 가드 — 첫 클릭 유실 시 재시도
    await expect(async () => {
      await page.getByRole("button", { name: "프로필 수정" }).click();
      await expect(
        page.getByRole("heading", { name: "프로필 설정" }).filter({ visible: true }),
      ).toBeVisible();
    }).toPass({ timeout: 10000 });

    const dialog = page.getByRole("dialog").filter({ visible: true });
    await dialog.getByLabel("휴대폰 번호").fill("010-9999-0000");
    await dialog.getByRole("button", { name: "저장하기" }).click();

    // 저장 성공 → 모달 닫힘 + 프로필 재검증 → 연락처·계정 카드 휴대폰 행에 새 번호 노출
    await expect(
      page.getByRole("heading", { name: "프로필 설정" }).filter({ visible: true }),
    ).toBeHidden();
    await expect(page.getByText("010-9999-0000").first()).toBeVisible();
  });

  test("프로필 수정에서 지역을 골라 저장하면 내 정보에 반영된다", async ({ page }) => {
    await page.goto(PATH);

    await expect(async () => {
      await page.getByRole("button", { name: "프로필 수정" }).click();
      await expect(
        page.getByRole("heading", { name: "프로필 설정" }).filter({ visible: true }),
      ).toBeVisible();
    }).toPass({ timeout: 10000 });

    // 저장된 지역("서울 강남구")이 드롭다운에 복원된다
    await expect(page.getByRole("button", { name: /서울 강남구/ })).toBeVisible();

    await selectRegion(page, "부산광역시", "해운대구", /서울 강남구/);
    await expect(page.getByRole("button", { name: /부산 해운대구/ })).toBeVisible();

    await page
      .getByRole("dialog", { name: "프로필 설정" })
      .getByRole("button", { name: "저장하기" })
      .click();

    await expect(
      page.getByRole("heading", { name: "프로필 설정" }).filter({ visible: true }),
    ).toBeHidden();
    await expect(page.getByText("부산 해운대구").first()).toBeVisible();
  });

  test("보험이 0건이면 빈 상태 안내가 보인다", async ({ page }) => {
    // MSW 서비스워커가 fetch를 가로채므로 page.route 대신 런타임 시나리오 헤더로 주입.
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "insurances-empty" });
    await page.goto(PATH);

    await expect(
      page.getByText("아직 등록된 보험이 없어요").filter({ visible: true }),
    ).toBeVisible();
    await expect(
      page.getByText(/보험사·상품명을 입력해 추가/).filter({ visible: true }),
    ).toBeVisible();
  });
});

// 카드는 상품명으로만 지목한다(필드명·DOM 구조 비의존).
const cardOf = (page: Page, productName: string) =>
  page.getByRole("article").filter({ hasText: productName });

test.describe("PC 내 보험 정보", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("증권을 올린 보험은 등록됨, 안 올린 보험은 미등록 배지가 보인다", async ({
    page,
  }) => {
    await page.goto(PATH);

    const withPolicy = cardOf(page, "무배당 행복드림 종합보험");
    await expect(withPolicy.getByText("증권 등록됨")).toBeVisible();
    await expect(withPolicy.getByRole("button", { name: "상세 보기" })).toBeVisible();

    const withoutPolicy = cardOf(page, "든든 의료실비보험");
    await expect(withoutPolicy.getByText("증권 미등록")).toBeVisible();
    await expect(
      withoutPolicy.getByRole("button", { name: "증권 올리기" }),
    ).toBeVisible();

    // 보장 칩이 카드에 노출된다
    await expect(withoutPolicy.getByText("실손의료비")).toBeVisible();
  });

  test("보험 추가는 백엔드 미구현으로 준비 중 안내만 표시한다", async ({ page }) => {
    await page.goto(PATH);

    await expect(page.getByRole("heading", { name: /내 보험 정보/ })).toContainText(
      "2건",
    );

    await expect(async () => {
      await page.getByRole("button", { name: "보험 추가" }).click();
      await expect(page.getByRole("status")).toHaveText("추후 지원 예정");
    }).toPass();
  });
});

test.describe("모바일 내 정보 허브", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("진입하면 내 정보 허브·프로필 카드·활동 스탯이 보인다", async ({ page }) => {
    await page.goto(PATH);

    await expect(
      page.getByRole("heading", { name: "내 정보" }).filter({ visible: true }),
    ).toBeVisible();
    await expect(
      page.getByText("일반 회원").filter({ visible: true }),
    ).toBeVisible();
    // 3분할 스탯(분석 리포트 / 받은 제안 / 종결) — 사이드바 "내 분석 리포트"와 구분 위해 exact
    await expect(
      page.getByText("분석 리포트", { exact: true }).filter({ visible: true }),
    ).toBeVisible();
    await expect(
      page.getByText("종결", { exact: true }).filter({ visible: true }),
    ).toBeVisible();
  });

  test("수정을 누르면 프로필 설정 바텀시트가 열린다", async ({ page }) => {
    await page.goto(PATH);

    await expect(async () => {
      await page.getByRole("button", { name: "수정", exact: true }).click();
      await expect(
        page.getByRole("heading", { name: "프로필 설정" }).filter({ visible: true }),
      ).toBeVisible();
    }).toPass({ timeout: 10000 });

    // NOTE(nit): 모달·시트 폼이 id="mypage-phone"를 공유해 label[for] 중복 → getByLabel 불가.
    // placeholder로 시트 내부 인풋을 지정(중복 id는 QA 리포트 nit로 보고).
    const sheet = page.getByRole("dialog").filter({ visible: true });
    await expect(sheet.getByPlaceholder("010-0000-0000")).toBeVisible();
    await expect(sheet.getByRole("button", { name: "저장하기" })).toBeVisible();
  });
});

test.describe("모바일 파트너 전환 role 조건부", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("일반 회원(USER)이면 파트너 전환 섹션이 없다", async ({ page }) => {
    await page.goto(PATH);

    // 허브가 렌더된 뒤(설정 리스트 노출) 파트너 전환 부재를 단언
    await expect(
      page.getByRole("heading", { name: "내 정보" }).filter({ visible: true }),
    ).toBeVisible();
    await expect(page.getByText("파트너 모드로 전환")).toHaveCount(0);
  });

  test("인증 손해사정사(CERTIFICATED_ADJUSTER)면 파트너 전환 섹션이 보인다", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      window.localStorage.setItem("mock:role", "CERTIFICATED_ADJUSTER");
    });
    await page.goto(PATH);

    await expect(page.getByText("파트너 모드로 전환")).toBeVisible();
    await expect(
      page.getByRole("link", { name: /파트너 모드로 전환/ }),
    ).toHaveAttribute("href", "/partner");
  });
});
