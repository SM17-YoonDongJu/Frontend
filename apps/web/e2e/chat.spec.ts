import { expect, test } from "@playwright/test";

/**
 * 채팅(상담) E2E (happy-path + 고가치 롤백, 이슈 #48).
 *
 * 원칙: 핵심 사용자 흐름만 — 목록 정렬/검색 → 스레드 진입(히스토리·날짜 구분선·mine/theirs)
 *   → 전송(낙관적 append·입력 초기화·빈 입력 비활성) → 전송 실패 롤백 → CLOSED 방 입력 차단
 *   → 데스크톱 분할 뷰 → partner 미러 → 공유 리포트 열기(역할별 목적지).
 * 응답은 기본 MSW 핸들러가 제공(방 3건: 김도현 ACTIVE·정우성 ACTIVE·윤지후 CLOSED).
 * 전송 실패는 x-mock-failure 헤더로 강제(핸들러 override), 형식·엣지 검증은 zod·TS에 위임(미테스트).
 */

const CUSTOMER_LIST = "/customer/chat";
const PARTNER_LIST = "/partner/chat";

const ROOM_KIM = "김도현 손해사정사";
const ROOM_JUNG = "정우성 손해사정사";
const ROOM_YOON = "윤지후 손해사정사";

test("목록에 진입하면 최근 대화가 위로 정렬되어 보인다", async ({ page }) => {
  await page.goto(CUSTOMER_LIST);

  const rooms = page.getByRole("listitem").filter({ hasText: "손해사정사" });
  await expect(rooms.first()).toContainText(ROOM_KIM);
  await expect(page.getByText(ROOM_JUNG)).toBeVisible();
  await expect(page.getByText(ROOM_YOON)).toBeVisible();
});

test("검색어를 입력하면 이름·마지막 메시지로 필터되고 없으면 빈 상태가 보인다", async ({
  page,
}) => {
  await page.goto(CUSTOMER_LIST);

  const search = page.getByRole("searchbox", { name: "대화 검색" });

  await search.fill("정우성");
  await expect(page.getByText(ROOM_JUNG)).toBeVisible();
  await expect(page.getByText(ROOM_KIM)).toBeHidden();

  await search.fill("외모추상"); // 정우성 방 lastMessage 일부
  await expect(page.getByText(ROOM_JUNG)).toBeVisible();

  await search.fill("존재하지않는검색어zzz");
  await expect(page.getByText("검색 결과가 없어요")).toBeVisible();
});

test("대화방에 들어가면 히스토리·날짜 구분선·양쪽 말풍선이 보인다", async ({
  page,
}) => {
  await page.goto(CUSTOMER_LIST);

  await expect(async () => {
    await page.getByRole("listitem").filter({ hasText: ROOM_KIM }).click();
    await expect(page).toHaveURL(/\/customer\/chat\/e1000000/);
  }).toPass({ timeout: 10000 });

  // theirs / mine 히스토리 메시지
  await expect(
    page.getByText("안녕하세요, 김도현 손해사정사입니다. 리포트 잘 받았습니다."),
  ).toBeVisible();
  await expect(page.getByText("그럼 어떻게 진행하면 될까요?")).toBeVisible();

  // 2일 이상 걸친 히스토리 → 날짜 구분선 2개
  await expect(page.getByText("2026.06.30")).toBeVisible();
  await expect(page.getByText("2026.07.01")).toBeVisible();
});

test("메시지를 보내면 즉시 추가되고 입력창이 비워진다", async ({ page }) => {
  await page.goto(`${CUSTOMER_LIST}`);
  await expect(async () => {
    await page.getByRole("listitem").filter({ hasText: ROOM_KIM }).click();
    await expect(page).toHaveURL(/\/customer\/chat\/e1000000/);
  }).toPass({ timeout: 10000 });

  const input = page.getByRole("textbox", { name: "메시지 입력" });
  const sendButton = page.getByRole("button", { name: "전송" });

  // 빈 입력은 전송 비활성
  await expect(sendButton).toBeDisabled();

  const text = "자동화 테스트 메시지입니다";
  await input.fill(text);
  await expect(sendButton).toBeEnabled();
  await sendButton.click();

  // 스레드 말풍선(우측 패널, DOM상 목록 프리뷰 뒤) — 낙관적 append 확인
  await expect(page.getByText(text).last()).toBeVisible();
  await expect(input).toHaveValue("");
});

test("전송이 실패하면 낙관적으로 추가된 메시지가 롤백된다", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-failure": "chat-send" });
  await page.goto(CUSTOMER_LIST);

  await expect(async () => {
    await page.getByRole("listitem").filter({ hasText: ROOM_KIM }).click();
    await expect(page).toHaveURL(/\/customer\/chat\/e1000000/);
  }).toPass({ timeout: 10000 });

  const input = page.getByRole("textbox", { name: "메시지 입력" });
  const failing = "롤백되어야 하는 메시지";
  await input.fill(failing);
  await page.getByRole("button", { name: "전송" }).click();

  // onError 롤백 → temp 메시지 제거
  await expect(page.getByText(failing)).toHaveCount(0);
});

test("종료된 상담방은 입력이 비활성화된다", async ({ page }) => {
  await page.goto(CUSTOMER_LIST);

  await expect(async () => {
    await page.getByRole("listitem").filter({ hasText: ROOM_YOON }).click();
    await expect(page).toHaveURL(/\/customer\/chat\/e1000000-0000-4000-8000-000000000003/);
  }).toPass({ timeout: 10000 });

  await expect(page.getByText("종료된 상담이에요. 새 메시지를 보낼 수 없어요.")).toBeVisible();
  await expect(page.getByRole("textbox", { name: "메시지 입력" })).toHaveCount(0);
});

test("데스크톱에서는 목록과 스레드가 분할 뷰로 함께 보이고 활성 행이 강조된다", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${CUSTOMER_LIST}/e1000000-0000-4000-8000-000000000001`);

  // 좌측 목록 패널(활성 행) + 우측 스레드가 동시에 렌더
  const activeItem = page.getByRole("listitem").filter({ hasText: ROOM_KIM });
  await expect(activeItem.getByRole("link")).toHaveAttribute("aria-current", "true");

  // 스레드 입력창(우측 패널)도 함께 노출
  await expect(page.getByRole("textbox", { name: "메시지 입력" })).toBeVisible();
});

test("고객 방에서 공유 리포트를 열면 고객 리포트로 이동한다", async ({ page }) => {
  await page.goto(`${CUSTOMER_LIST}/e1000000-0000-4000-8000-000000000001`);

  await expect(async () => {
    await page.getByRole("link", { name: "공유 리포트 열기" }).click();
    await expect(page).toHaveURL(/\/customer\/report\/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/);
  }).toPass({ timeout: 10000 });
});

test("파트너 채팅도 목록·스레드가 동작하고 리포트는 파트너 검수로 이동한다", async ({
  page,
}) => {
  await page.goto(PARTNER_LIST);
  await expect(page.getByText(ROOM_KIM)).toBeVisible();

  await page.goto(`${PARTNER_LIST}/e1000000-0000-4000-8000-000000000001`);
  await expect(page.getByRole("textbox", { name: "메시지 입력" })).toBeVisible();

  await expect(async () => {
    await page.getByRole("link", { name: "공유 리포트 열기" }).click();
    await expect(page).toHaveURL(/\/partner\/review\/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa/);
  }).toPass({ timeout: 10000 });
});
