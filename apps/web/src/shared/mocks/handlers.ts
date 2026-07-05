import { delay, http, HttpResponse } from "msw";
import { API_BASE_URL } from "@/shared/api/config";

// 로드 시점 기준 상대 마감일(로컬 달력 날짜) — 대시보드 "오늘 마감/N일 남음" 검증용
function addDays(base: Date, days: number): string {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

// 손해사정사 프로필 목 데이터 — 진입 adjusterId를 그대로 반영해 응답.
// 빈 후기·404 검증용 고정 id 분기.
const ADJUSTER_EMPTY_REVIEWS_ID = "00000000-0000-4000-8000-000000000000";
const ADJUSTER_NOT_FOUND_ID = "99999999-9999-4999-8999-999999999999";

function buildAdjusterProfile(adjusterId: string, withReviews: boolean) {
  return {
    adjusterId,
    nickname: "김도현",
    avatarUrl: null,
    headline: "장해등급 재산정 전문 · 근거 중심 검토",
    activityRegion: "서울 · 경기",
    introduction:
      "후유장해 등급 산정과 교통사고 보상을 12년간 다뤄온 독립 손해사정사입니다. 진단 검사 결과를 장해분류표에 정확히 매핑하고, 약관·특약·판례를 근거로 적정 보상 범위를 제시합니다. 의뢰인이 이해할 수 있도록 모든 판단의 근거를 함께 설명드립니다.",
    specialties: ["후유장해", "교통사고", "장해등급 재산정"],
    careers: [
      { period: "2018 – 현재", company: "독립 손해사정 법인 · 대표 사정사" },
      { period: "2014 – 2018", company: "대형 손해보험사 보상 심사팀" },
      { period: "2013", company: "손해사정사 자격 취득 (제0000호)" },
    ],
    career: 12,
    averageRating: withReviews ? 4.9 : 0,
    reviewCount: withReviews ? 86 : 0,
    recentReviews: withReviews
      ? [
          {
            nickname: "윤O서",
            score: 5,
            item: "교통사고 · 후유장해",
            reviewedAt: "2026-05-12T00:00:00Z",
            content:
              "장해등급 재산정으로 처음 제안보다 크게 증액됐어요. 근거를 약관·판례로 짚어주셔서 믿음이 갔습니다.",
          },
          {
            nickname: "이O준",
            score: 5,
            item: "실손 의료비",
            reviewedAt: "2026-04-03T00:00:00Z",
            content:
              "복잡한 특약 누락을 찾아주셨고 진행 상황을 매번 설명해 주셨습니다.",
          },
        ]
      : [],
    completedConsultCount: 240,
    handledCaseCount: 510,
    verified: true,
    consultGuide: {
      method: "비대면 · 방문",
      initialConsult: "무료 (리포트 기반)",
      feeBasis: "성공보수 협의",
    },
    certification: {
      registrationNo: "제0000호",
      verifiedAt: "2026-01-01T00:00:00Z",
    },
  };
}

// 검수 대기 목 데이터 — 보류 상태 반영 위해 모듈 스코프에 고정(reportId 안정)
const PENDING_REVIEWS = [
  { reportId: crypto.randomUUID(), accidentType: "disability", status: "AWAITING_INSPECTION", createdAt: "2026-06-19T09:00:00Z", caseId: "20260619-042", title: "우측 슬관절 후방십자인대 파열 · 등급 재산정 쟁점", region: "서울 강남", matchingScore: 96, claimedMinAmount: 12_000_000, claimedMaxAmount: 18_000_000, offerHeadroom: 5_500_000, issueCount: 2, reviewDeadline: addDays(new Date(), 0) },
  { reportId: crypto.randomUUID(), accidentType: "traffic", status: "AWAITING_INSPECTION", createdAt: "2026-06-19T08:10:00Z", caseId: "20260619-041", title: "다발성 늑골 골절 · 일실수입 과소 산정 의심", region: "경기 성남", matchingScore: 91, claimedMinAmount: 24_000_000, claimedMaxAmount: 31_000_000, offerHeadroom: 6_000_000, issueCount: 3, reviewDeadline: addDays(new Date(), 1) },
  { reportId: crypto.randomUUID(), accidentType: "disability", status: "AWAITING_INSPECTION", createdAt: "2026-06-18T16:40:00Z", caseId: "20260618-030", title: "요추 추간판탈출 · 외모추상 특약 청구 누락", region: "서울 송파", matchingScore: 88, claimedMinAmount: 9_000_000, claimedMaxAmount: 14_000_000, offerHeadroom: 2_800_000, issueCount: 2, reviewDeadline: addDays(new Date(), 3) },
  { reportId: crypto.randomUUID(), accidentType: "medical_indemnity", status: "AWAITING_INSPECTION", createdAt: "2026-06-18T11:20:00Z", caseId: "20260618-019", title: "비급여 도수치료 · 통원 한도 적용 분쟁", region: "인천 연수", matchingScore: 74, claimedMinAmount: 3_200_000, claimedMaxAmount: 4_800_000, offerHeadroom: 1_600_000, issueCount: 1, reviewDeadline: addDays(new Date(), 2) },
  { reportId: crypto.randomUUID(), accidentType: "traffic", status: "AWAITING_INSPECTION", createdAt: "2026-06-17T14:05:00Z", caseId: "20260517-007", title: "경추 염좌 · 향후 치료비 미반영", region: "경기 수원", matchingScore: 82, claimedMinAmount: 6_000_000, claimedMaxAmount: 9_000_000, offerHeadroom: 1_800_000, issueCount: 1, reviewDeadline: addDays(new Date(), 5) },
];

const heldReportIds = new Set<string>();

// 거절된 제안(키: `${reportId}:${adjusterId}`) — 거절 후 목록에서 제외 재현.
const rejectedProposals = new Set<string>();

// 고객 대시보드 — 받은 제안이 연결된 리포트(①)의 안정 uuid.
export const DASHBOARD_PROPOSABLE_REPORT_ID =
  "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const DASHBOARD_AWAITING_REPORT_ID = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

// 본인 손해사정사 프로필 — PATCH가 머지로 갱신하는 모듈 스코프 가변 객체
// (프로필 편집 화면 + 대시보드 헤더·인사말 공용 — 집계 필드 포함 superset, 각 소비자 스키마가 잔여 필드 strip)
const ADJUSTER_PROFILE: Record<string, unknown> = {
  adjusterId: "11111111-1111-4111-8111-111111111111",
  nickname: "김상정",
  headline: "후유장해 전문 12년, 거절 사건을 다시 봅니다",
  introduction:
    "교통사고·후유장해 중심으로 장해등급 산정과 약관 해석을 다뤄왔습니다. 의뢰인이 받은 제안을 약관·특약·판례에 비춰 다시 검토하고, 누락된 청구 가능성을 근거와 함께 설명드립니다.",
  career: 12,
  activityRegion: "서울·경기",
  avatarUrl: null,
  specialties: ["후유장해", "교통사고"],
  careers: [
    { period: "2014.03 ~ 2019.02", company: "OO손해사정법인" },
    { period: "2019.03 ~ 현재", company: "독립 손해사정사" },
  ],
  updatedAt: "2026-06-20T08:00:00Z",
  // 대시보드 헤더·인사말용 집계(읽기 전용)
  averageRating: 4.9,
  reviewCount: 86,
  pendingReviewCount: 5,
};

// ── 채팅(이슈 #48) 모듈 스코프 가변 상태 ─────────────────────────────
// senderId 정합: 내 메시지는 MOCK_ME_ID(= String(users/me.userId "1024")).
// 페이지가 넘기는 currentUserId도 String(me.userId)라 문자열 비교로 mine 판별.
// ⚠️ userId uuid 전환 백엔드 확인 요청 — 명세 senderId는 uuid, use-me.userId는 number.
const MOCK_ME_ID = "1024";

const CHAT_ADJUSTER_1_ID = "d1000000-0000-4000-8000-000000000001";
const CHAT_ADJUSTER_2_ID = "d1000000-0000-4000-8000-000000000002";
const CHAT_ADJUSTER_3_ID = "d1000000-0000-4000-8000-000000000003";

const CHAT_ROOM_1_ID = "e1000000-0000-4000-8000-000000000001";
const CHAT_ROOM_2_ID = "e1000000-0000-4000-8000-000000000002";
const CHAT_ROOM_3_ID = "e1000000-0000-4000-8000-000000000003";

interface MockChatRoom {
  chatRoomId: string;
  lastMessage: string | null;
  updatedAt: string;
  adjusterId: string;
  adjusterName: string;
  avatarUrl: string | null;
  reportId: string;
  caseNo: string;
  roomStatus: "REQUESTED" | "ACTIVE" | "CLOSED";
  lastMessageAt: string;
}

interface MockChatMessage {
  messageId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

const chatRooms: MockChatRoom[] = [
  {
    chatRoomId: CHAT_ROOM_1_ID,
    lastMessage: "리포트 검토해봤습니다. 상담 가능하세요?",
    updatedAt: "2026-07-01T10:32:00Z",
    adjusterId: CHAT_ADJUSTER_1_ID,
    adjusterName: "김도현 손해사정사",
    avatarUrl: null,
    reportId: DASHBOARD_PROPOSABLE_REPORT_ID,
    caseNo: "#20260520-017",
    roomStatus: "ACTIVE",
    lastMessageAt: "2026-07-01T10:32:00Z",
  },
  {
    chatRoomId: CHAT_ROOM_2_ID,
    lastMessage: "외모추상 특약도 함께 보겠습니다.",
    updatedAt: "2026-06-30T15:10:00Z",
    adjusterId: CHAT_ADJUSTER_2_ID,
    adjusterName: "정우성 손해사정사",
    avatarUrl: null,
    reportId: "f1000000-0000-4000-8000-000000000012",
    caseNo: "#20260512-009",
    roomStatus: "ACTIVE",
    lastMessageAt: "2026-06-30T15:10:00Z",
  },
  {
    chatRoomId: CHAT_ROOM_3_ID,
    lastMessage: "상담이 종료되었습니다.",
    updatedAt: "2026-06-20T09:00:00Z",
    adjusterId: CHAT_ADJUSTER_3_ID,
    adjusterName: "윤지후 손해사정사",
    avatarUrl: null,
    reportId: "f1000000-0000-4000-8000-000000000003",
    caseNo: "#20260428-003",
    roomStatus: "CLOSED",
    lastMessageAt: "2026-06-20T09:00:00Z",
  },
];

// 방별 메시지 히스토리(2일 이상 걸쳐 날짜 구분선 검증, mine/theirs 교차)
const chatMessages: Record<string, MockChatMessage[]> = {
  [CHAT_ROOM_1_ID]: [
    { messageId: "a1000000-0000-4000-8000-000000000001", senderId: CHAT_ADJUSTER_1_ID, content: "안녕하세요, 김도현 손해사정사입니다. 리포트 잘 받았습니다.", createdAt: "2026-06-30T09:00:00Z" },
    { messageId: "a1000000-0000-4000-8000-000000000002", senderId: MOCK_ME_ID, content: "네, 안녕하세요. 검토 부탁드려요.", createdAt: "2026-06-30T09:05:00Z" },
    { messageId: "a1000000-0000-4000-8000-000000000003", senderId: CHAT_ADJUSTER_1_ID, content: "장해등급 재산정 여지가 있어 보입니다.", createdAt: "2026-06-30T09:12:00Z" },
    { messageId: "a1000000-0000-4000-8000-000000000004", senderId: MOCK_ME_ID, content: "그럼 어떻게 진행하면 될까요?", createdAt: "2026-07-01T10:20:00Z" },
    { messageId: "a1000000-0000-4000-8000-000000000005", senderId: CHAT_ADJUSTER_1_ID, content: "리포트 검토해봤습니다. 상담 가능하세요?", createdAt: "2026-07-01T10:32:00Z" },
  ],
  [CHAT_ROOM_2_ID]: [
    { messageId: "a2000000-0000-4000-8000-000000000001", senderId: MOCK_ME_ID, content: "외모추상 특약도 청구할 수 있나요?", createdAt: "2026-06-29T14:00:00Z" },
    { messageId: "a2000000-0000-4000-8000-000000000002", senderId: CHAT_ADJUSTER_2_ID, content: "외모추상 특약도 함께 보겠습니다.", createdAt: "2026-06-30T15:10:00Z" },
  ],
  [CHAT_ROOM_3_ID]: [
    { messageId: "a3000000-0000-4000-8000-000000000001", senderId: CHAT_ADJUSTER_3_ID, content: "상담 도와드리겠습니다.", createdAt: "2026-06-18T09:00:00Z" },
    { messageId: "a3000000-0000-4000-8000-000000000002", senderId: MOCK_ME_ID, content: "감사합니다.", createdAt: "2026-06-19T11:00:00Z" },
    { messageId: "a3000000-0000-4000-8000-000000000003", senderId: CHAT_ADJUSTER_3_ID, content: "상담이 종료되었습니다.", createdAt: "2026-06-20T09:00:00Z" },
  ],
};

export const handlers = [
  http.get("/api/ping", () => HttpResponse.json({ message: "pong (mocked)" })),

  // 채팅방 목록 (이슈 #48) — 정확 경로. :param 라우트보다 먼저 등록.
  http.get(`${API_BASE_URL}/chats`, async ({ request }) => {
    await delay(400);

    if (request.headers.get("x-mock-failure") === "chat-list") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "채팅 목록을 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { items: chatRooms },
    });
  }),

  // 메시지 히스토리 (이슈 #48) — 커서 페이지네이션(?cursor&size, 기본 30).
  // CLOSED 방도 히스토리 조회 가능. 정확 경로(/chats)를 위에서 먼저 등록함.
  http.get(`${API_BASE_URL}/chats/:chatRoomId/messages`, async ({ params }) => {
    await delay(400);

    const chatRoomId = String(params.chatRoomId);
    const list = chatMessages[chatRoomId] ?? [];

    // MVP: 단일 페이지 반환(cursor 무시), 다음 페이지 없음.
    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { list, nextCursor: null },
    });
  }),

  // 메시지 전송 (이슈 #48) — CLOSED 방은 409, 그 외 상태 배열 append + 방 갱신.
  http.post(`${API_BASE_URL}/chats/:chatRoomId/messages`, async ({ request, params }) => {
    await delay(300);

    const chatRoomId = String(params.chatRoomId);

    if (request.headers.get("x-mock-failure") === "chat-send") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "메시지를 전송하지 못했습니다." },
        { status: 500 },
      );
    }

    const room = chatRooms.find((r) => r.chatRoomId === chatRoomId);
    if (room?.roomStatus === "CLOSED") {
      // CONTRACT: CLOSED 명세 코드 — ⚠️ Notion 명세 409 근거·전역 enum 반영 요청.
      return HttpResponse.json(
        { status: "409", code: "CLOSED", message: "종료된 상담입니다." },
        { status: 409 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as { content?: string };
    const content = typeof body.content === "string" ? body.content : "";
    const createdAt = new Date().toISOString();
    const messageId = crypto.randomUUID();

    (chatMessages[chatRoomId] ??= []).push({
      messageId,
      senderId: MOCK_ME_ID,
      content,
      createdAt,
    });

    if (room) {
      room.lastMessage = content;
      room.lastMessageAt = createdAt;
      room.updatedAt = createdAt;
    }

    return HttpResponse.json(
      {
        status: "201",
        message: "전송되었습니다.",
        data: { messageId, chatRoomId, senderId: MOCK_ME_ID, content, createdAt },
      },
      { status: 201 },
    );
  }),

  // 본인 프로필 조회 (이슈 #31 프로필 편집 + 대시보드 헤더 공용). :adjusterId 라우트보다 먼저 등록
  http.get(`${API_BASE_URL}/adjusters/me/profile`, async ({ request }) => {
    await delay(500);

    if (request.headers.get("x-mock-failure") === "profile") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "프로필을 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      status: "200",
      message: "조회 성공",
      data: ADJUSTER_PROFILE,
    });
  }),

  // 손해사정사 대시보드 요약·활동통계 (#30) — ⚠️ API 명세 미정(드리프트), MSW 선구현
  http.get(`${API_BASE_URL}/adjusters/me/dashboard`, async ({ request }) => {
    await delay(500);

    if (request.headers.get("x-mock-failure") === "dashboard") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "대시보드를 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        summary: {
          pendingCount: 5,
          pendingNewCount: 2,
          inProgressCount: 2,
          monthlyCompletedCount: 14,
          totalCompletedCount: 240,
          averageRating: 4.9,
          reviewCount: 86,
        },
        activity: {
          completedCount: 14,
          consultConvertedCount: 9,
          averageRating: 4.9,
        },
      },
    });
  }),

  // 진행 중 사건 (#30) — ⚠️ API 명세 미정(드리프트), MSW 선구현
  http.get(`${API_BASE_URL}/adjusters/me/in-progress`, async ({ request }) => {
    await delay(500);

    if (request.headers.get("x-mock-failure") === "in-progress") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "진행 중 사건을 불러오지 못했습니다." },
        { status: 500 },
      );
    }

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        list: [
          {
            reportId: "c1000000-0000-4000-8000-000000000022",
            accidentType: "후유장해",
            caseId: "20260528-022",
            description: "장해등급 재산정 의견 작성 중",
            status: "REVIEWING",
            progress: 65,
          },
          {
            reportId: "c1000000-0000-4000-8000-000000000019",
            accidentType: "교통사고",
            caseId: "20260527-019",
            description: "검수 완료 · 고객 상담 대기",
            status: "CUSTOMER_REVIEW",
            progress: 100,
          },
        ],
      },
    });
  }),

  // 본인 정보 조회 (고객 대시보드 인사말)
  http.get(`${API_BASE_URL}/users/me`, async () => {
    await delay(300);
    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        userId: 1024,
        nickname: "윤서",
        email: "yunseo@example.com",
        userType: "insured_person",
        createdAt: "2024-03-02T09:00:00Z",
      },
    });
  }),

  // 고객 리포트 목록 (대시보드) — :reportId·pending-review와 충돌 없게 정확 경로.
  // §9 드리프트 필드 선반영(reportNo·claimedMin/Max·proposalCount·reviewedAt·adjusterNickname).
  http.get(`${API_BASE_URL}/reports`, async ({ request }) => {
    await delay(400);

    const url = new URL(request.url, "http://localhost");
    const page = Number(url.searchParams.get("page") ?? "0");

    const list = [
      {
        reportId: DASHBOARD_PROPOSABLE_REPORT_ID,
        status: "MATCHED",
        accidentType: "교통사고",
        createdAt: "2026-05-20T09:00:00Z",
        reportNo: "20260520-017",
        claimedMinAmount: 14_000_000,
        claimedMaxAmount: 17_500_000,
        proposalCount: 2,
        reviewedAt: "2026-05-22T10:14:00Z",
        adjusterNickname: "김도현",
      },
      {
        reportId: DASHBOARD_AWAITING_REPORT_ID,
        status: "AWAITING_INSPECTION",
        accidentType: "실손",
        createdAt: "2026-05-12T09:00:00Z",
        reportNo: "20260512-009",
        claimedMinAmount: 3_200_000,
        claimedMaxAmount: 4_800_000,
        proposalCount: 0,
        reviewedAt: null,
        adjusterNickname: null,
      },
    ];

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        list,
        pagination: {
          page,
          size: 10,
          totalElements: list.length,
          totalPages: 1,
          hasNext: false,
        },
      },
    });
  }),

  // 본인 프로필 수정 — 수정 가능 필드만 머지 후 전체 프로필 반환
  http.patch(`${API_BASE_URL}/adjusters/me/profile`, async ({ request }) => {
    await delay(700);

    let body: Record<string, unknown>;
    try {
      body = (await request.json()) as Record<string, unknown>;
    } catch {
      return HttpResponse.json(
        { status: "400", code: "VALIDATION_ERROR", message: "입력 형식이 올바르지 않습니다." },
        { status: 400 },
      );
    }

    // 수정 가능 필드만 반영(읽기 전용·미지정 필드는 무시)
    const ADJUSTER_PROFILE_MUTABLE_FIELDS = [
      "headline",
      "introduction",
      "career",
      "activityRegion",
      "avatarUrl",
      "specialties",
      "careers",
    ] as const;
    for (const field of ADJUSTER_PROFILE_MUTABLE_FIELDS) {
      if (field in body) ADJUSTER_PROFILE[field] = body[field];
    }
    ADJUSTER_PROFILE.updatedAt = new Date().toISOString();

    return HttpResponse.json({
      status: "200",
      message: "수정 성공",
      data: ADJUSTER_PROFILE,
    });
  }),

  // 증빙 업로드 — 기본 성공(결정적). x-mock-failure 헤더로 실패 주입(재시도 검증용)
  http.post(`${API_BASE_URL}/uploads`, async ({ request }) => {
    await delay(800);

    if (request.headers.get("x-mock-failure") === "upload") {
      return HttpResponse.json(
        { status: "502", code: "EXTERNAL_API_ERROR", message: "업로드 처리 중 오류가 발생했습니다." },
        { status: 502 },
      );
    }

    const url = `https://cdn.example.com/uploads/${crypto.randomUUID()}/document`;
    return HttpResponse.json({ status: "200", message: "업로드 성공", data: { url } });
  }),

  // 분석 신청 생성 — 실손(medical_indemnity)만 허용, 그 외 UNSUPPORTED_OPERATION
  http.post(`${API_BASE_URL}/reports`, async ({ request }) => {
    await delay(600);
    const body = (await request.json()) as { accidentType?: string };

    if (body.accidentType !== "medical_indemnity") {
      return HttpResponse.json(
        { status: "400", code: "UNSUPPORTED_OPERATION", message: "현재 실손 의료비만 분석 가능합니다." },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        status: "202",
        message: "리포트 생성을 시작했습니다.",
        data: { reportId: crypto.randomUUID(), status: "AWAITING_INSPECTION" },
      },
      { status: 202 },
    );
  }),

  // 검수 대기 목록 (활성 손해사정사 전용) — :reportId 라우트보다 먼저 등록
  http.get(`${API_BASE_URL}/reports/pending-review`, async ({ request }) => {
    await delay(400);

    const url = new URL(request.url, "http://localhost");
    const page = Number(url.searchParams.get("page") ?? "1");
    const size = Number(url.searchParams.get("size") ?? "10");
    const accidentType = url.searchParams.get("accidentType");
    const region = url.searchParams.get("region");

    const list = PENDING_REVIEWS.filter(
      (review) =>
        (!accidentType || review.accidentType === accidentType) &&
        (!region || review.region === region),
    ).map((review) => ({
      ...review,
      held: heldReportIds.has(review.reportId),
    }));

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        list,
        pagination: { page, size, totalElements: list.length, totalPages: 1, hasNext: false },
      },
    });
  }),

  // 검수 보류 처리 (사정사별 토글)
  http.patch(`${API_BASE_URL}/reports/:reportId/hold`, async ({ params }) => {
    await delay(300);
    const reportId = String(params.reportId);
    heldReportIds.add(reportId);

    return HttpResponse.json({
      status: "200",
      message: "보류 처리되었습니다.",
      data: { reportId, held: true },
    });
  }),

  // 검수 현황 요약 (집계 카드 3종)
  http.get(`${API_BASE_URL}/reports/pending-review/summary`, async () => {
    await delay(300);

    const pendingCount = PENDING_REVIEWS.filter((r) => !heldReportIds.has(r.reportId)).length;

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: { pendingCount, specialtyMatchCount: 3, dueSoonCount: 1 },
    });
  }),

  // 받은 제안 목록 조회 (이슈 #18) — 거절된 제안은 제외
  http.get(`${API_BASE_URL}/reports/:reportId/proposals`, async ({ params }) => {
    await delay(500);

    const reportId = typeof params.reportId === "string" ? params.reportId : "";
    const list = [
      {
        adjusterId: "11111111-1111-4111-8111-111111111111",
        nickname: "김도현",
        rating: 4.8,
        proposalSummary: "장해등급 재산정으로 12급 적용 여지가 있어 보입니다. 상담 후 함께 판단해요.",
        status: "COMPLETED",
        submittedAt: "2026-05-22T10:14:00+09:00",
        speciality: "후유장해 전문",
        career: 12,
        isNew: true,
        isVerified: true,
        estimateMinAmount: 14_000_000,
        estimateMaxAmount: 17_500_000,
        feeBasis: "상담 시 서면 안내",
      },
      {
        adjusterId: "22222222-2222-4222-8222-222222222222",
        nickname: "정우성",
        rating: 4.6,
        proposalSummary: "외모추상 특약 누락 건까지 함께 청구를 검토할 수 있습니다.",
        status: "COMPLETED",
        submittedAt: "2026-05-21T16:40:00+09:00",
        speciality: "후유장해 전문",
        career: 18,
        isNew: true,
        isVerified: true,
        estimateMinAmount: 13_500_000,
        estimateMaxAmount: 17_000_000,
        feeBasis: "상담 시 서면 안내",
      },
      {
        adjusterId: "33333333-3333-4333-8333-333333333333",
        nickname: "이서연",
        rating: 4.9,
        proposalSummary: "과실 비율 재검토 여지가 있는지 리포트를 살펴보고 싶습니다.",
        status: "COMPLETED",
        submittedAt: "2026-05-20T09:05:00+09:00",
        speciality: "교통사고 전문",
        career: 8,
        isNew: false,
        isVerified: true,
        estimateMinAmount: null,
        estimateMaxAmount: null,
        feeBasis: "상담 시 서면 안내",
      },
    ];

    const visible = list.filter(
      (proposal) => !rejectedProposals.has(`${reportId}:${proposal.adjusterId}`),
    );

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        target: {
          accidentType: "교통사고 · 후유장해",
          reportNo: "20260520-017",
          receivedAt: "2026.05.20",
        },
        list: visible,
        pagination: {
          page: 1,
          size: 10,
          totalElements: visible.length,
          totalPages: 1,
          hasNext: false,
        },
      },
    });
  }),

  // 제안 거절 (사정사별) — 성공 시 해당 제안은 목록에서 제외
  http.patch(
    `${API_BASE_URL}/reports/:reportId/proposals/:adjusterId/reject`,
    async ({ params }) => {
      await delay(400);
      const rawReportId = typeof params.reportId === "string" ? params.reportId : "";
      const adjusterId =
        typeof params.adjusterId === "string" ? params.adjusterId : crypto.randomUUID();
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawReportId);

      rejectedProposals.add(`${rawReportId}:${adjusterId}`);

      return HttpResponse.json({
        status: "200",
        message: "제안을 거절했습니다.",
        data: { reportId: isUuid ? rawReportId : crypto.randomUUID(), adjusterId, rejected: true },
      });
    },
  ),

  // 손해사정사 공개 프로필 조회 (이슈 #32)
  http.get(`${API_BASE_URL}/adjusters/:adjusterId`, async ({ params }) => {
    await delay(500);

    const adjusterId =
      typeof params.adjusterId === "string"
        ? params.adjusterId
        : crypto.randomUUID();

    if (adjusterId === ADJUSTER_NOT_FOUND_ID) {
      return HttpResponse.json(
        { status: "404", code: "USER_NOT_FOUND", message: "손해사정사를 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    // 응답 adjusterId는 zod uuid 검증을 통과해야 함. 비-uuid 진입은 uuid로 대체.
    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(adjusterId);
    const responseAdjusterId = isUuid ? adjusterId : crypto.randomUUID();
    const withReviews = adjusterId !== ADJUSTER_EMPTY_REVIEWS_ID;

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: buildAdjusterProfile(responseAdjusterId, withReviews),
    });
  }),

  // 리포트 상세 조회
  // ⚠️ 명세 드리프트: 고객측(issue: CONFIRMED/TRUSTED/INFO)·사정사측(reviewIssues 리치) 동일 URL.
  //   양측 스키마가 unknown 키를 strip하므로 superset 응답으로 둘 다 통과시킴.
  http.get(`${API_BASE_URL}/reports/:reportId`, async ({ params }) => {
    await delay(500);

    const reportId =
      typeof params.reportId === "string"
        ? params.reportId
        : crypto.randomUUID();

    const isCustomerSample = reportId === "test-id-123";

    const isUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reportId);
    const responseReportId = isUuid ? reportId : crypto.randomUUID();

    return HttpResponse.json({
      status: "200",
      message: "정상 처리되었습니다.",
      data: {
        reportId: responseReportId,
        status: isCustomerSample ? "MATCHED" : "AWAITING_INSPECTION",
        accidentType: "교통사고(후유장해)",
        treatment: "우측 슬관절 후방십자인대 파열",
        claimedMinAmount: isCustomerSample ? 13_500_000 : 12_000_000,
        claimedMaxAmount: isCustomerSample ? 17_000_000 : 18_000_000,
        offeredAmount: 8_500_000,
        applicableGuarantees: ["상해후유장해 담보", "골절 진단비 특약", "입원·통원 일당"],
        omittedSpecialContract: ["외모변형 장해특약"],
        basisTermsPrecedents: [
          "약관 제12조 (후유장해 보험금 산정기준)",
          "분쟁조정 2023-1456 (장해등급 재산정 인정 사례)",
          "대법원 2019다○○○○ (후유장해 인과관계 판단)",
        ],
        issue: [
          {
            title: "외모추상 특약 누락",
            opinion: "누락분 청구 검토가 가장 확실한 출발점이에요.",
            status: "CONFIRMED",
            tag: "특약 제5조",
          },
          {
            title: "장해등급 적용",
            opinion: "현재 자료만으로는 12급 적용을 단정하기 어려워요.",
            status: "TRUSTED",
            tag: "약관 제12조",
          },
          {
            title: "진행 방향",
            opinion: "추가 의료자료 확보 → 재산정 순서를 권해요.",
            status: "INFO",
            tag: "분쟁조정 절차",
          },
        ],
        question: "보험금이 적게 나온 것 같아요",
        confidenceLevel: "HIGH",
        adjusterId: crypto.randomUUID(),
        reviewComment: isCustomerSample
          ? "누락된 청구 검토가 가능한 출발점입니다. 장해등급은 재검사 결과를 보고 판단하는 편이 안전합니다."
          : null,
        reviewedAt: isCustomerSample ? "2026.05.22" : null,
        adjuster: { nickname: "정우성", career: "12년 경력 손해사정사" },

        caseId: "20260531-042",
        accidentDate: "2026.05.01",
        insuranceName: "OO손해보험 · 행복드림",
        hospitalizations: [
          {
            hospitalStart: "2026.05.02",
            hospitalEnd: "2026.05.18",
            hospitalReason: "후방십자인대 파열 수술",
          },
          {
            hospitalStart: "2026.06.10",
            hospitalEnd: "2026.06.21",
            hospitalReason: "재활 및 관절 가동범위 회복 재입원",
          },
        ],
        description:
          "퇴근길 신호 대기 중 후방 추돌 사고를 당했습니다. 사고 직후 우측 무릎 통증과 부종이 심해 응급실에 내원했고, 정밀검사 결과 후방십자인대 파열 진단을 받아 입원 치료 후 수술을 받았습니다.",
        client: {
          maskedName: "윤O서",
          ageBand: "만 34세",
          gender: "여",
          region: "서울 강남",
          joinedAt: "2024.03",
        },
        isMasked: true,
        attachments: [
          {
            id: "att-1",
            name: "진단서",
            fileType: "PDF",
            pageCount: 2,
            url: "https://cdn.example.com/reports/att-1.pdf",
            issuedBy: "강남세브란스병원",
            issuedAt: "2026.05.18",
            aiSummary:
              "우측 슬관절 후방십자인대 완전 파열, 관절경적 재건술 시행. 향후 장해 잔존 가능성 명시.",
          },
          {
            id: "att-2",
            name: "MRI 영상 판독지",
            fileType: "PDF",
            pageCount: 1,
            url: "https://cdn.example.com/reports/att-2.pdf",
            issuedBy: "강남세브란스병원 영상의학과",
            issuedAt: "2026.05.03",
            aiSummary: "후방십자인대 연속성 소실 확인, 동반 반월상연골 손상 의심.",
          },
          {
            id: "att-3",
            name: "입퇴원 확인서",
            fileType: "JPG",
            pageCount: null,
            url: "https://cdn.example.com/reports/att-3.jpg",
            issuedBy: "병원 발행",
            issuedAt: "2026.05.18",
            aiSummary: null,
          },
        ],
        // ⚠️ 명세 드리프트: 명세 issue는 string[]. 리치 reviewIssues 별도 키로 superset 반환.
        reviewIssues: [
          {
            issueId: "issue-1",
            title: "후유장해 등급 재산정",
            description:
              "AI 초안은 14급으로 추정했으나, 관절 운동범위 제한 정도를 고려하면 12급 적용 여지가 있습니다.",
            impactAmount: 3_500_000,
            reviewStatus: "PENDING",
            modifiedReason: null,
            excludedReason: null,
            adjusterOpinion: null,
            tags: ["약관 제12조", "분쟁조정 2023-1456"],
            isNew: false,
          },
          {
            issueId: "issue-2",
            title: "입원 일당 미반영분",
            description: "입원 17일 중 초안에 14일만 반영되어 3일분 누락 추정.",
            impactAmount: 600_000,
            reviewStatus: "PENDING",
            modifiedReason: null,
            excludedReason: null,
            adjusterOpinion: null,
            tags: ["특약 제5조"],
            isNew: false,
          },
          {
            issueId: "issue-3",
            title: "외모변형 장해 특약 적용",
            description:
              "수술 흉터 관련 외모변형 장해 특약 청구 가능성 검토 항목.",
            impactAmount: null,
            reviewStatus: "PENDING",
            modifiedReason: null,
            excludedReason: null,
            adjusterOpinion: null,
            tags: ["외모변형 장해특약"],
            isNew: false,
          },
        ],
      },
    });
  }),

  // 검수 반영 제출 (사정사) — body echo, 검수완료 시 AWAITING_ADOPTION
  http.patch(`${API_BASE_URL}/reports/:reportId`, async ({ request, params }) => {
    await delay(600);

    if (request.headers.get("x-mock-failure") === "submit-review") {
      return HttpResponse.json(
        { status: "500", code: "INTERNAL_SERVER_ERROR", message: "검수 반영 중 오류가 발생했습니다." },
        { status: 500 },
      );
    }

    const body = (await request.json().catch(() => ({}))) as { status?: string };
    const reportId =
      typeof params.reportId === "string"
        ? params.reportId
        : crypto.randomUUID();

    return HttpResponse.json({
      status: "200",
      message: "검수 내용이 반영되었습니다.",
      data: { reportId, status: body.status ?? "AWAITING_ADOPTION" },
    });
  }),
];
