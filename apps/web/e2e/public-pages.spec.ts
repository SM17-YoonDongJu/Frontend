import { expect, test } from "@playwright/test";

/**
 * 공개 마케팅 페이지 E2E — 서비스 소개(/about)·이용 방법(/guide)·문의하기(/contact) (공개 페이지 슬라이스).
 *
 * 원칙(fe-e2e-strategy): 핵심 사용자 흐름(CUJ) happy-path만 — 랜딩 헤더에서 두 페이지로
 *   진입 → 콘텐츠 노출 → FAQ 디스클로저 동작 → CTA로 로그인 진입 → 로그인 전후 푸터에서 문의하기 진입.
 * 데이터 없음(순수 Server Component, API·MSW 무관) — 렌더는 서버 정적 콘텐츠.
 * 저가치(개별 카드 문구 전수·반응형 그리드 열 수·아이콘 매핑)는 정적 레이어(TS·리뷰)에 위임(미테스트).
 */

const LANDING = "/";
const ABOUT = "/about";
const GUIDE = "/guide";
const CONTACT = "/contact";

test.describe("공개 페이지 진입 흐름", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  // 기본 목은 로그인 유저라 랜딩 게이트가 대시보드로 replace — 클릭이 판별보다 빠를 때만
  // 통과하는 레이스가 된다(webkit 간헐 실패). 비로그인 주입으로 랜딩을 고정.
  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
  });

  test("랜딩 헤더의 서비스 소개를 누르면 /about 히어로가 보인다", async ({ page }) => {
    await page.goto(LANDING);

    await expect(async () => {
      await page
        .getByRole("navigation", { name: "주요 메뉴" })
        .getByRole("link", { name: "서비스 소개" })
        .click();
      await expect(page).toHaveURL(/\/about$/);
    }).toPass({ timeout: 10000 });

    await expect(
      page.getByRole("heading", { name: "받은 보험금, 혼자 판단하지 마세요" })
    ).toBeVisible();
  });

  test("랜딩 헤더의 이용 방법을 누르면 /guide 4스텝이 보인다", async ({ page }) => {
    await page.goto(LANDING);

    await expect(async () => {
      await page
        .getByRole("navigation", { name: "주요 메뉴" })
        .getByRole("link", { name: "이용 방법" })
        .click();
      await expect(page).toHaveURL(/\/guide$/);
    }).toPass({ timeout: 10000 });

    await expect(page.getByRole("heading", { name: "분석부터 상담까지, 네 단계" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "분석 신청" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "상담·매칭" })).toBeVisible();
  });
});

test.describe("이용 방법 FAQ 디스클로저", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("FAQ 질문을 누르면 답변이 펼쳐진다", async ({ page }) => {
    await page.goto(GUIDE);

    const answer = page.getByText(
      "바른보상의 분석은 참고용 추정이며 결과를 보장하지 않습니다.",
      { exact: false }
    );
    await expect(answer).toBeHidden();

    await expect(async () => {
      await page.getByText("보험금을 더 받을 수 있나요?", { exact: true }).click();
      await expect(answer).toBeVisible();
    }).toPass({ timeout: 10000 });
  });
});

test.describe("문의하기 진입 흐름", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("비로그인 상태로 /contact에 바로 접근하면 안내와 이메일이 보인다", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
    await page.goto(CONTACT);

    await expect(page.getByRole("heading", { name: "문의하기" })).toBeVisible();
    await expect(page.getByRole("link", { name: "teambrbosang@gmail.com" })).toBeVisible();
  });

  test("이메일과 문의 내용을 입력해 제출하면 접수 완료 화면이 보인다", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
    await page.goto(CONTACT);

    await page.getByPlaceholder("답변받으실 이메일 주소").fill("user@example.com");
    await page.getByPlaceholder("문의하실 내용을 입력해주세요.").fill("문의 내용 테스트입니다.");
    await page.getByRole("button", { name: "문의 보내기" }).click();

    await expect(page.getByText("문의가 접수되었습니다")).toBeVisible();
  });

  test("랜딩 푸터의 문의하기를 누르면 /contact로 이동한다", async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
    await page.goto(LANDING);

    await expect(async () => {
      await page.getByRole("contentinfo").getByRole("link", { name: "문의하기" }).click();
      await expect(page).toHaveURL(/\/contact$/);
    }).toPass({ timeout: 10000 });
  });

  test("로그인 유저 대시보드 푸터의 문의하기를 누르면 /contact로 이동한다", async ({ page }) => {
    await page.goto("/customer/dashboard");

    await expect(async () => {
      await page.getByRole("contentinfo").getByRole("link", { name: "문의하기" }).click();
      await expect(page).toHaveURL(/\/contact$/);
    }).toPass({ timeout: 10000 });
  });
});

test.describe("공개 페이지 CTA", () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  // 기본 목(로그인 유저)이면 /login 진입 가드가 홈으로 되돌려 URL 단언이 레이스가 된다.
  test.beforeEach(async ({ page }) => {
    await page.setExtraHTTPHeaders({ "x-mock-scenario": "unauthenticated" });
  });

  test("서비스 소개 하단 CTA를 누르면 로그인으로 이동한다", async ({ page }) => {
    await page.goto(ABOUT);

    await expect(async () => {
      // 히어로·하단 밴드 두 곳에 같은 라벨(둘 다 /login) → 하단 밴드 CTA를 지정.
      await page.getByRole("link", { name: "내 보상 분석하기" }).last().click();
      await expect(page).toHaveURL(/\/login/);
    }).toPass({ timeout: 10000 });
  });

  test("이용 방법 하단 CTA를 누르면 로그인으로 이동한다", async ({ page }) => {
    await page.goto(GUIDE);

    await expect(async () => {
      // 히어로·하단 밴드 두 곳에 같은 라벨(둘 다 /login) → 하단 밴드 CTA를 지정.
      await page.getByRole("link", { name: "분석 신청하기" }).last().click();
      await expect(page).toHaveURL(/\/login/);
    }).toPass({ timeout: 10000 });
  });
});
