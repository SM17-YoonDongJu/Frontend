import { expect, test } from "@playwright/test";
import { setAuthCookie } from "./_auth-cookie-helpers";

/**
 * 받은 제안 목록 E2E (happy-path, 이슈 #18/#123).
 *
 * 원칙: 핵심 사용자 흐름만 — 목록 열람 / 상담 수락 / 상담채팅 진행 / 매칭 완료(형제 제안 자동 종료) / 상세 보기 이동.
 * 시드 제안 3건: 김도현·정우성 COUNSELING("상담채팅 진행"+"매칭 완료"), 윤지후 SENT("상담 수락").
 * 채팅방은 제안 발송 시 선생성(#231) — SENT의 "상담 수락"은 생성 API 없이 기존 방으로 즉시 이동한다.
 * 응답은 기본 MSW 핸들러가 제공 — 제안은 채팅 시드와 동일 원천(같은 사건 3건: 김도현·정우성·윤지후).
 * 거절 진입은 채팅 화면으로 일원화(#123) — 거절 흐름은 chat.spec.ts가 검증한다.
 * 빈 상태는 핸들러 오버라이드가 필요해 의식적으로 테스트하지 않는다(정적 레이어가 하위 대체).
 * 수락 실패는 x-mock-failure:match-proposal 헤더(fetch 래핑 주입 — MSW는 SW라 page.route 불가)로
 * 500을 강제해 실패 토스트 노출을 검증한다(이슈 #127).
 */

// 채팅·제안 공용 시드 사건(reportId) — handlers.ts DASHBOARD_PROPOSABLE_REPORT_ID
const REPORT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const PATH = `/customer/proposals/${REPORT_ID}`;

test.beforeEach(async ({ page }) => {
  await setAuthCookie(page, "USER");
});

test("진입하면 받은 제안 목록과 분석 대상 정보가 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(page.getByRole("heading", { name: "받은 제안" })).toBeVisible();

  // 분석 대상(proposals 응답 target)
  await expect(page.getByText("No.20260520-017")).toBeVisible();

  // 제안 카드(3건)
  await expect(page.getByText("김도현")).toBeVisible();
  await expect(page.getByText("정우성")).toBeVisible();
  await expect(page.getByText("윤지후")).toBeVisible();
});

test("상담채팅 진행을 누르면 해당 제안의 채팅방으로 이동한다", async ({ page }) => {
  await page.goto(PATH);

  const firstCard = page.getByRole("listitem").filter({ hasText: "김도현" });
  await expect(firstCard).toBeVisible();

  const chatButton = firstCard.getByRole("button", { name: "상담채팅 진행" });
  // 방 조회(GET /chats)가 끝나야 활성화된다
  await expect(chatButton).toBeEnabled();

  await expect(async () => {
    await chatButton.click();
    await expect(page).toHaveURL(/\/customer\/chat\/[0-9a-f-]+/);
  }).toPass({ timeout: 10000 });
});

test("상담 수락을 누르면 확인 화면 없이 해당 제안의 채팅방으로 바로 이동한다", async ({
  page,
}) => {
  await page.goto(PATH);

  const sentCard = page.getByRole("listitem").filter({ hasText: "윤지후" });
  await expect(sentCard).toBeVisible();

  await expect(async () => {
    await sentCard.getByRole("button", { name: "상담 수락" }).click();
    // 윤지후 방(CHAT_ROOM_3) — 중간 확인 화면 없이 채팅방 URL로 직행
    await expect(page).toHaveURL(/\/customer\/chat\/e1000000-0000-4000-8000-000000000003/);
  }).toPass({ timeout: 10000 });
});

test("매칭을 완료하면 매칭한 제안만 남는다", async ({ page }) => {
  await page.goto(PATH);

  const firstCard = page.getByRole("listitem").filter({ hasText: "김도현" });
  await expect(firstCard).toBeVisible();

  await firstCard.getByRole("button", { name: "매칭 완료" }).click();

  // 확인 모달을 거쳐야 채택된다(#122)
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "매칭 완료" }).click();

  // 수락 시 같은 사건의 다른 제안은 자동 종료 → 목록에서 제외
  await expect(page.getByText("정우성")).toHaveCount(0);
  await expect(page.getByText("윤지후")).toHaveCount(0);
  await expect(firstCard).toBeVisible();

  // 매칭 완료된 제안은 뱃지로 바뀐다(ACCEPTED)
  await expect(firstCard.getByText("매칭 완료", { exact: true })).toBeVisible();
});

test("매칭 완료 확인을 취소하면 제안이 그대로 유지된다", async ({ page }) => {
  await page.goto(PATH);

  const firstCard = page.getByRole("listitem").filter({ hasText: "김도현" });
  await expect(firstCard).toBeVisible();

  await firstCard.getByRole("button", { name: "매칭 완료" }).click();

  // 다른 제안이 함께 종료된다는 안내가 보인다
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("함께 종료되는 상담 2건")).toBeVisible();

  await dialog.getByRole("button", { name: "취소" }).click();
  await expect(dialog).toHaveCount(0);

  // 채택 요청이 나가지 않아 모든 제안이 남는다
  await expect(page.getByText("정우성")).toBeVisible();
  await expect(page.getByText("윤지후")).toBeVisible();
});

test("매칭 완료가 실패하면 실패 안내 토스트가 보이고 제안 목록은 유지된다", async ({ page }) => {
  // MSW는 브라우저 서비스워커라 page.route/CDP 헤더로는 못 가로챈다.
  // 페이지 컨텍스트에서 fetch를 감싸 x-mock-failure 헤더를 실어야 SW가 본다.
  await page.addInitScript(() => {
    const originalFetch = window.fetch;
    window.fetch = (input, init = {}) => {
      const headers = new Headers(init.headers);
      headers.set("x-mock-failure", "match-proposal");
      return originalFetch(input, { ...init, headers });
    };
  });
  await page.goto(PATH);

  const firstCard = page.getByRole("listitem").filter({ hasText: "김도현" });
  await expect(firstCard).toBeVisible();

  await firstCard.getByRole("button", { name: "매칭 완료" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "매칭 완료" }).click();

  // 실패 토스트(role="alert")가 뜨고, 매칭이 반영되지 않아 모든 제안이 남는다
  // Next 라우트 어나운서도 role="alert"라 문구로 좁힌다
  await expect(
    page.getByRole("alert").filter({ hasText: "매칭 완료 처리에 실패했어요" }),
  ).toBeVisible();
  // 실패 시 모달이 열린 채라(형제 이름 중복 노출) 카드 문구로 좁힌다
  await expect(page.getByText("정우성 손해사정사")).toBeVisible();
  await expect(page.getByText("윤지후 손해사정사")).toBeVisible();
});

test("상세 보기를 누르면 리포트 상세로 이동한다", async ({ page }) => {
  await page.goto(PATH);

  const firstCard = page.getByRole("listitem").filter({ hasText: "김도현" });
  await expect(firstCard).toBeVisible();

  await expect(async () => {
    await firstCard.getByRole("button", { name: "상세 보기" }).click();
    await expect(page).toHaveURL(new RegExp(`/customer/report/${REPORT_ID}`));
  }).toPass({ timeout: 10000 });
});

// 목 데이터 정합(#153) — 리포트 목록의 제안 건수와 제안 목록 응답이 같은 원천을 봐야 한다.
// 채팅 시드가 없는 리포트에서 빈 목록·고정 target이 돌아오던 회귀를 가드한다.

test("리포트 목록의 제안 N건 보기로 들어가면 N건의 제안이 보인다", async ({ page }) => {
  await page.goto("/customer/reports");

  await expect(async () => {
    await page.getByRole("link", { name: "제안 5건 보기" }).click();
    await expect(page).toHaveURL(/\/customer\/proposals\/c3d0e1f2/);
  }).toPass({ timeout: 10000 });

  // 분석 대상이 해당 리포트의 실제 값으로 파생된다(고정 target 회귀 방지)
  await expect(page.getByText("No.20260430-118")).toBeVisible();

  // 제안 카드 5건
  await expect(page.getByText("박지훈")).toBeVisible();
  await expect(page.getByText("서예린")).toBeVisible();
  await expect(page.getByText("권도윤")).toBeVisible();
  await expect(page.getByText("임채원")).toBeVisible();
  await expect(page.getByText("백승호")).toBeVisible();
});

test("받은 제안 목록 카드의 건수와 상세 목록 건수가 일치한다", async ({ page }) => {
  await page.goto("/customer/proposals");

  const card = page.getByRole("link").filter({ hasText: "실손 · 도수치료 한도" });
  await expect(card).toBeVisible();
  await expect(card.getByText("제안 2 건")).toBeVisible();

  await expect(async () => {
    await card.click();
    await expect(page).toHaveURL(/\/customer\/proposals\/a1000000/);
  }).toPass({ timeout: 10000 });

  // 카드가 약속한 2건이 그대로 보인다
  await expect(page.getByText("No.20260415-031")).toBeVisible();
  await expect(page.getByText("박준호")).toBeVisible();
  await expect(page.getByText("오민석")).toBeVisible();
});
