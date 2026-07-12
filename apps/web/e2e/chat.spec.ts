import { expect, test } from "@playwright/test";

/**
 * 채팅(상담) E2E — 비교→매칭 마켓플레이스 재설계(이슈 #48).
 *
 * customer 흐름: 목록 상태 그룹(상담 중·비교 N) → 스레드 진입(히스토리·날짜 구분선·mine/theirs)
 *   → 전송(낙관적 append·롤백) → 매칭 완료(모달·형제 자동종료 캐스케이드)·매칭 거절(단일 종료)
 *   → 매칭 후 사건 진행 보기 → 공유 리포트 열기.
 * partner 무회귀: 평면 목록(그룹 없음)·헤더 상담 종료 버튼·상담 종료 흐름 그대로.
 *
 * 시드(기본 MSW): 같은 reportId·caseNo 3방(김도현·정우성·윤지후) 전부 ACTIVE·COUNSELING(=비교 중).
 * 전송 실패는 x-mock-failure 헤더로 강제. 매칭 액션 버튼은 데스크톱 헤더(md+) 전용 → 뷰포트 확대.
 */

const CUSTOMER_LIST = "/customer/chat";
const PARTNER_LIST = "/partner/chat";

const ROOM_KIM = "김도현 손해사정사";
const ROOM_JUNG = "정우성 손해사정사";
const ROOM_YOON = "윤지후 손해사정사";

const ROOM_1 = "e1000000-0000-4000-8000-000000000001";
const SHARED_REPORT_ID = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";

const DESKTOP = { width: 1280, height: 900 };

test("목록에 진입하면 최근 대화가 위로 정렬되어 보인다", async ({ page }) => {
  await page.goto(CUSTOMER_LIST);

  const rooms = page.getByRole("listitem").filter({ hasText: "손해사정사" });
  await expect(rooms.first()).toContainText(ROOM_KIM);
  await expect(page.getByText(ROOM_JUNG)).toBeVisible();
  await expect(page.getByText(ROOM_YOON)).toBeVisible();
});

test("고객 목록은 매칭 상태 그룹(상담 중·비교)으로 묶여 보인다", async ({ page }) => {
  await page.goto(CUSTOMER_LIST);

  // 같은 사건 3방이 전부 비교 중 → "상담 중 · 비교" 섹션 + 카운트 3
  const section = page.getByText("상담 중 · 비교", { exact: true });
  await expect(section).toBeVisible();
  await expect(
    page.getByRole("listitem").filter({ hasText: "손해사정사" }),
  ).toHaveCount(3);
});

test("검색어를 입력하면 이름·마지막 메시지로 필터되고 없으면 빈 상태가 보인다", async ({
  page,
}) => {
  // 대화 검색은 모바일 전용 UI(Figma 데스크톱 목록엔 검색창 없음)
  await page.setViewportSize({ width: 390, height: 844 });
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

test("대화가 하나도 없으면 안내와 손해사정사 찾기 CTA가 보인다", async ({ page }) => {
  await page.setExtraHTTPHeaders({ "x-mock-empty": "chat-list" });
  await page.goto(CUSTOMER_LIST);

  await expect(page.getByText("아직 진행 중인 대화가 없어요")).toBeVisible();

  await expect(async () => {
    await page.getByRole("link", { name: "손해사정사 찾아보기" }).click();
    await expect(page).toHaveURL(/\/customer\/adjusters/);
  }).toPass({ timeout: 10000 });
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

  // onError 롤백 → temp 말풍선 제거 + 실패 안내 + 입력창에 내용 복원(재시도 가능)
  await expect(
    page.getByText("메시지를 보내지 못했어요. 다시 시도해 주세요."),
  ).toBeVisible();
  await expect(input).toHaveValue(failing);
  // 말풍선은 롤백으로 제거(입력창 value는 getByText 매칭 대상 아님)
  await expect(page.getByText(failing)).toHaveCount(0);
});

test("파일을 첨부하면 파일 말풍선으로 전송된다", async ({ page }) => {
  await page.goto(`${CUSTOMER_LIST}/${ROOM_1}`);
  await expect(page.getByRole("textbox", { name: "메시지 입력" })).toBeVisible();

  // 첨부 버튼 노출 + 숨은 파일 입력으로 업로드(⚠️ 명세없음-초안, MSW 목)
  await expect(page.getByRole("button", { name: "파일 첨부" }).first()).toBeVisible();
  await page.locator('input[type="file"]').first().setInputFiles({
    name: "진단서.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from("mock-pdf"),
  });

  // 업로드→전송 후 파일 칩 말풍선 표시(목록 미리보기 "📎 진단서.pdf"와 구분해 exact 매치)
  await expect(page.getByText("진단서.pdf", { exact: true })).toBeVisible();
});

test("이전 대화는 위로 스크롤하면 이어서 불러온다", async ({ page }) => {
  await page.goto(`${CUSTOMER_LIST}/${ROOM_1}`);

  // 최신 페이지에는 가장 오래된 메시지가 아직 없다
  await expect(page.getByText("장해등급 재산정 여지가 있어 보입니다.")).toBeVisible();
  await expect(page.getByText("이전 답변 내용 1번입니다.")).toHaveCount(0);

  // 상단 센티널로 스크롤 → 이전 페이지 로드
  await page.getByText(/이전 대화/).scrollIntoViewIfNeeded();
  await expect(page.getByText("이전 답변 내용 1번입니다.")).toBeVisible();
});

test("비교 중 방 헤더에는 매칭 거절·매칭 완료 버튼이 보인다", async ({ page }) => {
  // 매칭 액션은 데스크톱 헤더(md+) 전용
  await page.setViewportSize(DESKTOP);
  await page.goto(`${CUSTOMER_LIST}/${ROOM_1}`);

  await expect(page.getByRole("button", { name: "매칭 거절" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "매칭 완료" }).first()).toBeVisible();
  // 비교 배너(스레드 상단)
  await expect(page.getByText(/명과 상담 중 · 마음에 들면/)).toBeVisible();
});

test("모바일에서도 헤더 매칭 버튼으로 매칭을 완료할 수 있다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  // 목록 상단 비교 배너(모바일 전용 문구)
  await page.goto(CUSTOMER_LIST);
  await expect(page.getByText(/3명과 상담 중이에요/)).toBeVisible();

  // 스레드 헤더 컴팩트 매칭 버튼 → 모달 → 확정
  await page.goto(`${CUSTOMER_LIST}/${ROOM_1}`);
  await expect(page.getByRole("button", { name: "매칭 거절" })).toBeVisible();
  await page.getByRole("button", { name: "매칭 완료" }).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText("함께 종료되는 상담 2건")).toBeVisible();
  await dialog.getByRole("button", { name: "매칭 완료" }).click();

  // 매칭 후 — 모바일 헤더에 사건 진행 링크
  await expect(page.getByRole("link", { name: /사건 진행/ })).toBeVisible();
});

test("매칭 완료를 확정하면 형제 상담이 종료되고 매칭 완료로 바뀐다", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(`${CUSTOMER_LIST}/${ROOM_1}`);

  await page.getByRole("button", { name: "매칭 완료" }).click();

  // 확인 모달 — 함께 종료되는 상담 2건(정우성·윤지후)
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/매칭할까요\?/)).toBeVisible();
  await expect(dialog.getByText("함께 종료되는 상담 2건")).toBeVisible();

  await dialog.getByRole("button", { name: "매칭 완료" }).click();

  // 매칭 완료 → 배너 전환 + 목록 형제 방 종료 그룹 이동
  await expect(page.getByText("이 사정사와 매칭됐어요 · 자료 검토 단계 진행 중")).toBeVisible();
  await expect(page.getByText("진행 중 · 매칭 완료", { exact: true })).toBeVisible();
  await expect(page.getByText("종료된 상담", { exact: true })).toBeVisible();

  // 매칭 후 사건 진행 보기 → 고객 리포트 이동
  await expect(async () => {
    await page.getByRole("link", { name: "사건 진행 보기" }).click();
    await expect(page).toHaveURL(new RegExp(`/customer/report/${SHARED_REPORT_ID}`));
  }).toPass({ timeout: 10000 });
});

test("매칭 거절을 누르면 그 방만 종료되고 입력이 차단된다", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(`${CUSTOMER_LIST}/${ROOM_1}`);

  const input = page.getByRole("textbox", { name: "메시지 입력" });
  await expect(input).toBeEnabled();
  await page.getByRole("button", { name: "매칭 거절" }).click();

  // 거절도 확인 모달을 거친다(비가역 액션)
  const rejectDialog = page.getByRole("dialog");
  await expect(rejectDialog.getByText(/상담을 종료할까요\?/)).toBeVisible();
  await rejectDialog.getByRole("button", { name: "매칭 거절" }).click();

  // 거절한 방은 종료 — 입력·전송이 회색 비활성으로 잠김, 나머지 비교 유지
  await expect(input).toBeDisabled();
  await expect(input).toHaveAttribute(
    "placeholder",
    "종료된 상담이에요. 새 메시지를 보낼 수 없어요.",
  );
  await expect(page.getByRole("button", { name: "전송" })).toBeDisabled();
  await expect(page.getByText("상담 중 · 비교", { exact: true })).toBeVisible();
});

test("종료된 상담 그룹은 기본으로 접혀 있고 헤더를 누르면 펼쳐진다", async ({ page }) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(`${CUSTOMER_LIST}/${ROOM_1}`);

  // 김도현 방을 거절(확인 모달 경유)해 종료 그룹 생성
  await page.getByRole("button", { name: "매칭 거절" }).click();
  await page.getByRole("dialog").getByRole("button", { name: "매칭 거절" }).click();
  const endedHeader = page.getByRole("button", { name: /종료된 상담/ });
  await expect(endedHeader).toBeVisible();

  // 기본 접힘 — 종료된 김도현 행이 목록에 없음
  await expect(endedHeader).toHaveAttribute("aria-expanded", "false");
  await expect(
    page.getByRole("listitem").filter({ hasText: ROOM_KIM }),
  ).toHaveCount(0);

  // 헤더 클릭 → 펼침, 행 노출
  await endedHeader.click();
  await expect(endedHeader).toHaveAttribute("aria-expanded", "true");
  await expect(
    page.getByRole("listitem").filter({ hasText: ROOM_KIM }),
  ).toHaveCount(1);

  // 다시 클릭 → 접힘
  await endedHeader.click();
  await expect(
    page.getByRole("listitem").filter({ hasText: ROOM_KIM }),
  ).toHaveCount(0);
});

test("데스크톱에서는 목록과 스레드가 분할 뷰로 함께 보이고 활성 행이 강조된다", async ({
  page,
  isMobile,
}) => {
  // 분할 뷰는 md+ 전용 — 모바일 프로젝트에선 실제로 노출되지 않으므로 데스크톱에서만 검증
  test.skip(isMobile, "분할 뷰는 데스크톱(md+) 전용 레이아웃");
  await page.goto(`${CUSTOMER_LIST}/${ROOM_1}`);

  // 좌측 목록 패널(활성 행) + 우측 스레드가 동시에 렌더
  const activeItem = page.getByRole("listitem").filter({ hasText: ROOM_KIM });
  await expect(activeItem.getByRole("link")).toHaveAttribute("aria-current", "true");

  // 스레드 입력창(우측 패널)도 함께 노출
  await expect(page.getByRole("textbox", { name: "메시지 입력" })).toBeVisible();
});

test("고객 방에서 공유 리포트를 열면 고객 리포트로 이동한다", async ({ page }) => {
  // 비교 중 모바일 헤더는 매칭 버튼이 리포트 아이콘을 대체(Figma 1012:9931) — 리포트 보기는 데스크톱 헤더에서
  await page.setViewportSize(DESKTOP);
  await page.goto(`${CUSTOMER_LIST}/${ROOM_1}`);

  await expect(async () => {
    await page.getByRole("link", { name: "리포트 보기" }).click();
    await expect(page).toHaveURL(new RegExp(`/customer/report/${SHARED_REPORT_ID}`));
  }).toPass({ timeout: 10000 });
});

test("파트너 채팅은 그룹 없는 평면 목록·상담 종료 흐름을 유지한다(무회귀)", async ({
  page,
}) => {
  await page.setViewportSize(DESKTOP);
  await page.goto(PARTNER_LIST);

  // 평면 목록 — 상태 그룹 섹션 헤더가 없어야 한다
  await expect(page.getByText(ROOM_KIM)).toBeVisible();
  await expect(page.getByText("상담 중 · 비교", { exact: true })).toHaveCount(0);
  await expect(page.getByText("진행 중 · 매칭 완료", { exact: true })).toHaveCount(0);

  // 스레드 — partner는 상담 종료 버튼(매칭 아님) 유지
  await page.goto(`${PARTNER_LIST}/${ROOM_1}`);
  await expect(page.getByRole("button", { name: "매칭 완료" })).toHaveCount(0);
  await expect(page.getByRole("textbox", { name: "메시지 입력" })).toBeVisible();

  await page.getByRole("button", { name: "상담 종료" }).click();
  const input = page.getByRole("textbox", { name: "메시지 입력" });
  await expect(input).toBeDisabled();
  await expect(input).toHaveAttribute(
    "placeholder",
    "종료된 상담이에요. 새 메시지를 보낼 수 없어요.",
  );
});

test("파트너 방에서 공유 리포트를 열면 파트너 검수로 이동한다", async ({ page }) => {
  await page.goto(`${PARTNER_LIST}/${ROOM_1}`);

  await expect(async () => {
    await page.getByRole("link", { name: "리포트 보기" }).click();
    await expect(page).toHaveURL(new RegExp(`/partner/review/${SHARED_REPORT_ID}`));
  }).toPass({ timeout: 10000 });
});
