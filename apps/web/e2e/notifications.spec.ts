import { expect, test } from "@playwright/test";

/**
 * 알림 페이지 E2E (이슈 #49).
 *
 * 원칙: 핵심 사용자 흐름만 — 목록·날짜 그룹 열람 / 모두 읽음 / 에러 안내.
 * 응답은 기본 MSW 핸들러(GET /users/me/notifications)가 제공(알림 5건: 오늘·어제·이전 + 안읽음 2건).
 * 에러 상태는 핸들러가 검사하는 `x-mock-failure` 헤더를 주입해 강제한다(MSW는 SW라 page.route로는 가로챌 수 없음).
 * 아이콘 매핑·상대시간 포맷·필드 형식은 zod·TS에 위임(미테스트).
 */

const PATH = "/notifications";

test("진입하면 알림 목록과 날짜 그룹이 보인다", async ({ page }) => {
  await page.goto(PATH);

  await expect(page.getByRole("heading", { level: 1, name: "알림" })).toBeVisible();

  // 카드 제목(기본 핸들러 5건 중 대표)
  await expect(page.getByRole("heading", { name: "검수가 완료됐어요" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "본인 인증 완료" })).toBeVisible();

  // 날짜 그룹 헤딩 — 고정 과거(2026-05-18) 항목이 항상 "이전"을 만든다.
  await expect(page.getByRole("heading", { name: "이전", exact: true })).toBeVisible();
});

test("모두 읽음을 누르면 안읽음 표시가 사라진다", async ({ page }) => {
  await page.goto(PATH);

  const unreadDots = page.getByLabel("읽지 않은 알림");
  // 기본 핸들러: 안읽음 2건
  await expect(unreadDots.first()).toBeVisible();

  await expect(async () => {
    await page.getByRole("button", { name: "모두 읽음" }).click();
    await expect(unreadDots).toHaveCount(0);
  }).toPass({ timeout: 10000 });
});

test("알림이 없으면 빈 상태 안내가 보인다", async ({ page }) => {
  // 빈 목록은 MSW 기본 핸들러가 못 만들므로 fetch를 감싸 빈 응답을 직접 반환(SW 우회).
  await page.addInitScript(() => {
    const originalFetch = window.fetch;
    window.fetch = (input, init) => {
      const url = typeof input === "string" ? input : input instanceof Request ? input.url : String(input);
      if (url.includes("/users/me/notifications") && !url.includes("read-all")) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              status: "200",
              message: "정상 처리되었습니다.",
              data: { items: [], unread_count: 0, page: 0, size: 20, total_elements: 0, total_pages: 0 },
            }),
            { status: 200, headers: { "Content-Type": "application/json" } },
          ),
        );
      }
      return originalFetch(input, init);
    };
  });
  await page.goto(PATH);

  await expect(page.getByText("새 알림이 없어요")).toBeVisible();
  await expect(page.getByRole("button", { name: "알림 설정 확인하기" })).toBeVisible();
});

test("불러오기에 실패하면 에러 안내가 보인다", async ({ page }) => {
  // MSW는 브라우저 서비스워커라 page.route/CDP 헤더로는 못 가로챈다.
  // 페이지 컨텍스트에서 fetch를 감싸 x-mock-failure 헤더를 실어야 SW가 본다.
  await page.addInitScript(() => {
    const originalFetch = window.fetch;
    window.fetch = (input, init = {}) => {
      const headers = new Headers(init.headers);
      headers.set("x-mock-failure", "notifications");
      return originalFetch(input, { ...init, headers });
    };
  });
  await page.goto(PATH);

  // 쿼리 기본 재시도(3회 지수 백오프)를 소진한 뒤 에러 바운더리가 뜬다 — 넉넉한 타임아웃.
  await expect(page.getByText("알림을 불러오지 못했어요")).toBeVisible({ timeout: 15000 });
  await expect(page.getByRole("button", { name: "다시 시도" })).toBeVisible();
});
